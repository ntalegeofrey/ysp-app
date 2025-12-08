package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.*;
import app.ysp.entity.*;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MedicationService {

    private final ResidentMedicationRepository medicationRepository;
    private final MedicationAdministrationRepository administrationRepository;
    private final MedicationAuditRepository auditRepository;
    private final MedicationAuditCountRepository auditCountRepository;
    private final MedicationAlertRepository alertRepository;
    private final ProgramRepository programRepository;
    private final ProgramResidentRepository residentRepository;
    private final UserRepository userRepository;
    private final SseHub sseHub;

    public MedicationService(
            ResidentMedicationRepository medicationRepository,
            MedicationAdministrationRepository administrationRepository,
            MedicationAuditRepository auditRepository,
            MedicationAuditCountRepository auditCountRepository,
            MedicationAlertRepository alertRepository,
            ProgramRepository programRepository,
            ProgramResidentRepository residentRepository,
            UserRepository userRepository,
            SseHub sseHub) {
        this.medicationRepository = medicationRepository;
        this.administrationRepository = administrationRepository;
        this.auditRepository = auditRepository;
        this.auditCountRepository = auditCountRepository;
        this.alertRepository = alertRepository;
        this.programRepository = programRepository;
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.sseHub = sseHub;
    }

    // ============ RESIDENT MEDICATIONS ============

    /**
     * Add a new medication for a resident
     */
    @Transactional
    public ResidentMedicationResponse addResidentMedication(Long programId, ResidentMedicationRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        ProgramResident resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        ResidentMedication medication = new ResidentMedication();
        medication.setProgram(program);
        medication.setResident(resident);
        medication.setMedicationName(request.getMedicationName());
        medication.setDosage(request.getDosage());
        medication.setFrequency(request.getFrequency());
        medication.setInitialCount(request.getInitialCount());
        medication.setCurrentCount(request.getInitialCount());
        medication.setPrescribingPhysician(request.getPrescribingPhysician());
        medication.setSpecialInstructions(request.getSpecialInstructions());
        medication.setPrescriptionDate(request.getPrescriptionDate());
        medication.setAddedByStaff(staff);
        medication.setStatus("ACTIVE");

        ResidentMedication saved = medicationRepository.save(medication);

        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "medication_added",
                "programId", programId,
                "residentId", resident.getId(),
                "medicationName", saved.getMedicationName()
        ));

        return mapToMedicationResponse(saved);
    }

    /**
     * Get all active medications for a resident
     */
    public List<ResidentMedicationResponse> getResidentMedications(Long residentId) {
        List<ResidentMedication> medications = medicationRepository
                .findByResident_IdAndStatusOrderByCreatedAtDesc(residentId, "ACTIVE");
        return medications.stream()
                .map(this::mapToMedicationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all medications for a program
     */
    public List<ResidentMedicationResponse> getProgramMedications(Long programId) {
        List<ResidentMedication> medications = medicationRepository
                .findByProgram_IdAndStatusOrderByCreatedAtDesc(programId, "ACTIVE");
        return medications.stream()
                .map(this::mapToMedicationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Update medication count (after administration)
     */
    @Transactional
    public void updateMedicationCount(Long medicationId, Integer newCount) {
        ResidentMedication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        medication.setCurrentCount(newCount);
        medicationRepository.save(medication);
    }

    /**
     * Decrement medication count by quantity (handles different medication types)
     */
    @Transactional
    public void decrementMedicationCount(Long medicationId, Integer quantity) {
        ResidentMedication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        
        String medType = medication.getMedicationType();
        
        if ("COUNTABLE".equals(medType)) {
            // Normal medications - decrement count
            Integer currentCount = medication.getCurrentCount();
            Integer newCount = Math.max(0, currentCount - quantity);
            medication.setCurrentCount(newCount);
        } else if ("NON_COUNTABLE".equals(medType)) {
            // Ointments, sprays, mouthwash - always keep at 1 (always available)
            medication.setCurrentCount(1);
        } else if ("RECORD_ONLY".equals(medType)) {
            // Inhalers, ventolins - don't change count (record only)
            // Do nothing - just log the administration
        }
        
        medicationRepository.save(medication);
    }

    /**
     * Discontinue a medication
     */
    @Transactional
    public void discontinueMedication(Long medicationId) {
        ResidentMedication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        medication.setStatus("DISCONTINUED");
        medicationRepository.save(medication);
    }

    /**
     * Update medication details
     */
    @Transactional
    public void updateMedication(Long medicationId, Map<String, Object> updates) {
        ResidentMedication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        
        if (updates.containsKey("medicationName")) {
            medication.setMedicationName((String) updates.get("medicationName"));
        }
        if (updates.containsKey("dosage")) {
            medication.setDosage((String) updates.get("dosage"));
        }
        if (updates.containsKey("frequency")) {
            medication.setFrequency((String) updates.get("frequency"));
        }
        if (updates.containsKey("prescribingPhysician")) {
            medication.setPrescribingPhysician((String) updates.get("prescribingPhysician"));
        }
        if (updates.containsKey("specialInstructions")) {
            medication.setSpecialInstructions((String) updates.get("specialInstructions"));
        }
        
        medication.setUpdatedAt(Instant.now());
        medicationRepository.save(medication);
    }

    /**
     * Delete a medication (sets status to DELETED)
     */
    @Transactional
    public void deleteMedication(Long medicationId) {
        ResidentMedication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        medication.setStatus("DELETED");
        medication.setUpdatedAt(Instant.now());
        medicationRepository.save(medication);
    }

    // ============ MEDICATION ADMINISTRATION ============

    /**
     * Log a medication administration
     */
    @Transactional
    public MedicationAdministrationResponse logAdministration(Long programId, MedicationAdministrationRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        ProgramResident resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        ResidentMedication medication = medicationRepository.findById(request.getResidentMedicationId())
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        MedicationAdministration administration = new MedicationAdministration();
        administration.setProgram(program);
        administration.setResident(resident);
        administration.setResidentMedication(medication);
        administration.setAdministrationDate(request.getAdministrationDate());
        administration.setAdministrationTime(request.getAdministrationTime());
        administration.setShift(request.getShift());
        administration.setAction(request.getAction());
        administration.setNotes(request.getNotes());
        administration.setWasLate(request.getWasLate());
        administration.setMinutesLate(request.getMinutesLate());
        administration.setAdministeredByStaff(staff);

        MedicationAdministration saved = administrationRepository.save(administration);

        // If administered, decrement count
        if ("ADMINISTERED".equals(request.getAction())) {
            medication.setCurrentCount(medication.getCurrentCount() - 1);
            medicationRepository.save(medication);
        }

        // Create alerts for refused or missed medications
        if ("REFUSED".equals(request.getAction()) || "MISSED".equals(request.getAction())) {
            createAlert(programId, resident.getId(), medication.getId(),
                    "CRITICAL",
                    "Medication " + request.getAction() + ": " + resident.getFirstName() + " " + resident.getLastName() + " - " + medication.getMedicationName(),
                    medication.getMedicationName() + " " + medication.getDosage() + " was " + request.getAction().toLowerCase() + " on " + request.getAdministrationDate()
            );
        }

        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "medication_administered",
                "programId", programId,
                "residentId", resident.getId(),
                "action", request.getAction()
        ));

        return mapToAdministrationResponse(saved);
    }

    /**
     * Get medication administrations for a date range
     */
    public Map<String, Object> getAdministrations(Long programId, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicationAdministration> adminPage = administrationRepository
                .filterAdministrations(programId, null, null, null, startDate, endDate, pageable);

        List<MedicationAdministrationResponse> administrations = adminPage.getContent().stream()
                .map(this::mapToAdministrationResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", administrations);
        response.put("totalPages", adminPage.getTotalPages());
        response.put("totalElements", adminPage.getTotalElements());
        response.put("currentPage", adminPage.getNumber());
        return response;
    }

    /**
     * Get medication administrations for a specific resident
     */
    public List<MedicationAdministrationResponse> getResidentAdministrations(Long residentId) {
        List<MedicationAdministration> administrations = administrationRepository
                .findByResident_IdOrderByAdministrationDateDescAdministrationTimeDesc(residentId);
        return administrations.stream()
                .map(this::mapToAdministrationResponse)
                .collect(Collectors.toList());
    }

    // ============ MEDICATION AUDITS ============

    /**
     * Submit a medication audit
     */
    @Transactional
    public MedicationAuditResponse submitAudit(Long programId, MedicationAuditRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        MedicationAudit audit = new MedicationAudit();
        audit.setProgram(program);
        audit.setAuditDate(request.getAuditDate());
        audit.setAuditTime(request.getAuditTime());
        audit.setShift(request.getShift());
        audit.setAuditNotes(request.getAuditNotes());
        audit.setSubmittedByStaff(staff);
        audit.setStatus("PENDING");

        // Check for discrepancies
        boolean hasDiscrepancies = request.getCounts().stream()
                .anyMatch(c -> !c.getCurrentCount().equals(c.getPreviousCount()));
        audit.setHasDiscrepancies(hasDiscrepancies);

        MedicationAudit savedAudit = auditRepository.save(audit);

        // Save audit counts
        for (MedicationAuditRequest.AuditCountItem countItem : request.getCounts()) {
            ProgramResident resident = residentRepository.findById(countItem.getResidentId())
                    .orElseThrow(() -> new RuntimeException("Resident not found"));
            ResidentMedication medication = medicationRepository.findById(countItem.getResidentMedicationId())
                    .orElseThrow(() -> new RuntimeException("Medication not found"));

            MedicationAuditCount count = new MedicationAuditCount();
            count.setAudit(savedAudit);
            count.setResident(resident);
            count.setResidentMedication(medication);
            count.setPreviousCount(countItem.getPreviousCount());
            count.setCurrentCount(countItem.getCurrentCount());
            count.setVariance(countItem.getCurrentCount() - countItem.getPreviousCount());
            count.setNotes(countItem.getNotes());

            // Get previous staff name from medication
            String previousStaffName = medication.getAddedByStaff().getFirstName() + " " +
                    medication.getAddedByStaff().getLastName();
            count.setPreviousStaffName(previousStaffName);

            auditCountRepository.save(count);
        }

        // Send SSE notification for pending approval
        sseHub.broadcast(Map.of(
                "type", "audit_submitted",
                "programId", programId,
                "auditId", savedAudit.getId(),
                "shift", request.getShift(),
                "hasDiscrepancies", hasDiscrepancies
        ));

        return mapToAuditResponse(savedAudit);
    }

    /**
     * Get pending audits for a program
     */
    public List<MedicationAuditResponse> getPendingAudits(Long programId) {
        List<MedicationAudit> audits = auditRepository.findPendingByProgram(programId);
        return audits.stream()
                .map(this::mapToAuditResponse)
                .collect(Collectors.toList());
    }

    /**
     * Approve or deny an audit
     */
    @Transactional
    public MedicationAuditResponse approveAudit(Long auditId, MedicationAuditApprovalRequest request, Long staffId) {
        MedicationAudit audit = auditRepository.findById(auditId)
                .orElseThrow(() -> new RuntimeException("Audit not found"));
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        audit.setStatus(request.getStatus());
        audit.setApprovedByStaff(staff);
        audit.setApprovalDate(Instant.now());
        audit.setApprovalNotes(request.getApprovalNotes());

        // If approved, update medication counts
        if ("APPROVED".equals(request.getStatus())) {
            List<MedicationAuditCount> counts = auditCountRepository.findByAudit_Id(auditId);
            for (MedicationAuditCount count : counts) {
                ResidentMedication medication = count.getResidentMedication();
                medication.setCurrentCount(count.getCurrentCount());
                medicationRepository.save(medication);
            }
        }

        MedicationAudit saved = auditRepository.save(audit);

        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "audit_reviewed",
                "programId", audit.getProgram().getId(),
                "auditId", saved.getId(),
                "status", request.getStatus()
        ));

        return mapToAuditResponse(saved);
    }

    /**
     * Get audits with pagination and filters
     */
    public Map<String, Object> getAudits(Long programId, String status, String shift, 
                                         LocalDate startDate, LocalDate endDate, 
                                         Boolean hasDiscrepancies, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<MedicationAudit> auditPage = auditRepository
                .filterAudits(programId, status, shift, startDate, endDate, hasDiscrepancies, pageable);

        List<MedicationAuditResponse> audits = auditPage.getContent().stream()
                .map(this::mapToAuditResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", audits);
        response.put("totalPages", auditPage.getTotalPages());
        response.put("totalElements", auditPage.getTotalElements());
        response.put("currentPage", auditPage.getNumber());
        return response;
    }

    // ============ MEDICATION ALERTS ============

    /**
     * Get active alerts for a program
     */
    public List<MedicationAlertResponse> getActiveAlerts(Long programId) {
        List<MedicationAlert> alerts = alertRepository.findByProgram_IdAndStatusOrderByCreatedAtDesc(programId, "ACTIVE");
        return alerts.stream()
                .map(this::mapToAlertResponse)
                .collect(Collectors.toList());
    }

    /**
     * Resolve an alert
     */
    @Transactional
    public void resolveAlert(Long alertId, Long staffId) {
        MedicationAlert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        alert.setStatus("RESOLVED");
        alert.setResolvedByStaff(staff);
        alert.setResolvedAt(Instant.now());
        alertRepository.save(alert);

        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "alert_resolved",
                "programId", alert.getProgram().getId(),
                "alertId", alertId
        ));
    }

    /**
     * Create a new alert
     */
    @Transactional
    public void createAlert(Long programId, Long residentId, Long medicationId,
                           String alertType, String title, String description) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        MedicationAlert alert = new MedicationAlert();
        alert.setProgram(program);
        
        if (residentId != null) {
            ProgramResident resident = residentRepository.findById(residentId)
                    .orElseThrow(() -> new RuntimeException("Resident not found"));
            alert.setResident(resident);
        }
        
        if (medicationId != null) {
            ResidentMedication medication = medicationRepository.findById(medicationId)
                    .orElseThrow(() -> new RuntimeException("Medication not found"));
            alert.setResidentMedication(medication);
        }
        
        alert.setAlertType(alertType);
        alert.setTitle(title);
        alert.setDescription(description);
        alert.setAlertTime(LocalTime.now());
        alert.setStatus("ACTIVE");

        MedicationAlert saved = alertRepository.save(alert);

        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "new_alert",
                "programId", programId,
                "alertId", saved.getId(),
                "alertType", alertType
        ));
    }

    // ============ MAPPING METHODS ============

    private ResidentMedicationResponse mapToMedicationResponse(ResidentMedication medication) {
        ResidentMedicationResponse response = new ResidentMedicationResponse();
        response.setId(medication.getId());
        response.setProgramId(medication.getProgram().getId());
        response.setResidentId(medication.getResident().getId());
        response.setResidentName(medication.getResident().getFirstName() + " " + medication.getResident().getLastName());
        response.setResidentNumber(medication.getResident().getResidentId());
        response.setMedicationName(medication.getMedicationName());
        response.setDosage(medication.getDosage());
        response.setFrequency(medication.getFrequency());
        response.setInitialCount(medication.getInitialCount());
        response.setCurrentCount(medication.getCurrentCount());
        response.setRemainingCount(medication.getCurrentCount());
        response.setPrescribingPhysician(medication.getPrescribingPhysician());
        response.setSpecialInstructions(medication.getSpecialInstructions());
        response.setPrescriptionDate(medication.getPrescriptionDate());
        response.setStatus(medication.getStatus());
        response.setAddedByStaffId(medication.getAddedByStaff().getId());
        response.setAddedByStaffName(medication.getAddedByStaff().getFirstName() + " " + medication.getAddedByStaff().getLastName());
        response.setCreatedAt(medication.getCreatedAt());
        response.setUpdatedAt(medication.getUpdatedAt());
        response.setIsLowInventory(medication.getCurrentCount() <= 10);
        return response;
    }

    private MedicationAdministrationResponse mapToAdministrationResponse(MedicationAdministration admin) {
        MedicationAdministrationResponse response = new MedicationAdministrationResponse();
        response.setId(admin.getId());
        response.setProgramId(admin.getProgram().getId());
        response.setResidentId(admin.getResident().getId());
        response.setResidentName(admin.getResident().getFirstName() + " " + admin.getResident().getLastName());
        response.setResidentNumber(admin.getResident().getResidentId());
        response.setResidentMedicationId(admin.getResidentMedication().getId());
        response.setMedicationName(admin.getResidentMedication().getMedicationName());
        response.setDosage(admin.getResidentMedication().getDosage());
        response.setAdministrationDate(admin.getAdministrationDate());
        response.setAdministrationTime(admin.getAdministrationTime());
        response.setShift(admin.getShift());
        response.setAction(admin.getAction());
        response.setNotes(admin.getNotes());
        response.setWasLate(admin.getWasLate());
        response.setMinutesLate(admin.getMinutesLate());
        if (admin.getAdministeredByStaff() != null) {
            response.setAdministeredByStaffId(admin.getAdministeredByStaff().getId());
            String firstName = admin.getAdministeredByStaff().getFirstName() != null ? admin.getAdministeredByStaff().getFirstName() : "";
            String lastName = admin.getAdministeredByStaff().getLastName() != null ? admin.getAdministeredByStaff().getLastName() : "";
            response.setAdministeredByStaffName((firstName + " " + lastName).trim());
        }
        response.setCreatedAt(admin.getCreatedAt());
        return response;
    }

    private MedicationAuditResponse mapToAuditResponse(MedicationAudit audit) {
        MedicationAuditResponse response = new MedicationAuditResponse();
        response.setId(audit.getId());
        response.setProgramId(audit.getProgram().getId());
        response.setAuditDate(audit.getAuditDate());
        response.setAuditTime(audit.getAuditTime());
        response.setShift(audit.getShift());
        response.setAuditNotes(audit.getAuditNotes());
        response.setStatus(audit.getStatus());
        response.setHasDiscrepancies(audit.getHasDiscrepancies());
        response.setSubmittedByStaffId(audit.getSubmittedByStaff().getId());
        response.setSubmittedByStaffName(audit.getSubmittedByStaff().getFirstName() + " " + audit.getSubmittedByStaff().getLastName());
        
        if (audit.getApprovedByStaff() != null) {
            response.setApprovedByStaffId(audit.getApprovedByStaff().getId());
            response.setApprovedByStaffName(audit.getApprovedByStaff().getFirstName() + " " + audit.getApprovedByStaff().getLastName());
            response.setApprovalDate(audit.getApprovalDate());
            response.setApprovalNotes(audit.getApprovalNotes());
        }
        
        // Map counts
        List<MedicationAuditCount> counts = auditCountRepository.findByAudit_Id(audit.getId());
        List<MedicationAuditResponse.AuditCountDetail> countDetails = counts.stream()
                .map(this::mapToAuditCountDetail)
                .collect(Collectors.toList());
        response.setCounts(countDetails);
        
        // Compute fields
        response.setTotalMedications(counts.size());
        response.setTotalResidents((int) counts.stream().map(c -> c.getResident().getId()).distinct().count());
        response.setDiscrepancyCount((int) counts.stream().filter(c -> c.getVariance() != 0).count());
        
        response.setCreatedAt(audit.getCreatedAt());
        response.setUpdatedAt(audit.getUpdatedAt());
        return response;
    }

    private MedicationAuditResponse.AuditCountDetail mapToAuditCountDetail(MedicationAuditCount count) {
        MedicationAuditResponse.AuditCountDetail detail = new MedicationAuditResponse.AuditCountDetail();
        detail.setId(count.getId());
        detail.setResidentId(count.getResident().getId());
        detail.setResidentName(count.getResident().getFirstName() + " " + count.getResident().getLastName());
        detail.setResidentNumber(count.getResident().getResidentId());
        detail.setResidentMedicationId(count.getResidentMedication().getId());
        detail.setMedicationName(count.getResidentMedication().getMedicationName());
        detail.setDosage(count.getResidentMedication().getDosage());
        detail.setPreviousCount(count.getPreviousCount());
        detail.setCurrentCount(count.getCurrentCount());
        detail.setVariance(count.getVariance());
        detail.setPreviousStaffName(count.getPreviousStaffName());
        detail.setNotes(count.getNotes());
        return detail;
    }

    private MedicationAlertResponse mapToAlertResponse(MedicationAlert alert) {
        MedicationAlertResponse response = new MedicationAlertResponse();
        response.setId(alert.getId());
        response.setProgramId(alert.getProgram().getId());
        
        if (alert.getResident() != null) {
            response.setResidentId(alert.getResident().getId());
            response.setResidentName(alert.getResident().getFirstName() + " " + alert.getResident().getLastName());
            response.setResidentNumber(alert.getResident().getResidentId());
        }
        
        if (alert.getResidentMedication() != null) {
            response.setResidentMedicationId(alert.getResidentMedication().getId());
            response.setMedicationName(alert.getResidentMedication().getMedicationName());
            response.setDosage(alert.getResidentMedication().getDosage());
        }
        
        response.setAlertType(alert.getAlertType());
        response.setTitle(alert.getTitle());
        response.setDescription(alert.getDescription());
        response.setAlertTime(alert.getAlertTime());
        response.setStatus(alert.getStatus());
        
        if (alert.getResolvedByStaff() != null) {
            response.setResolvedByStaffId(alert.getResolvedByStaff().getId());
            response.setResolvedByStaffName(alert.getResolvedByStaff().getFirstName() + " " + alert.getResolvedByStaff().getLastName());
            response.setResolvedAt(alert.getResolvedAt());
        }
        
        response.setCreatedAt(alert.getCreatedAt());
        return response;
    }

    /**
     * Get user ID by email
     */
    public Long getUserIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return user.getId();
    }
}

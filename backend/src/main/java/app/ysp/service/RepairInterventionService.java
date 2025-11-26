package app.ysp.service;

import app.ysp.dto.RepairInterventionRequest;
import app.ysp.dto.RepairInterventionResponse;
import app.ysp.dto.RepairReviewRequest;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.entity.RepairIntervention;
import app.ysp.domain.User;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repository.RepairInterventionRepository;
import app.ysp.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RepairInterventionService {

    private final RepairInterventionRepository repairRepo;
    private final ProgramRepository programRepo;
    private final ProgramResidentRepository residentRepo;
    private final UserRepository userRepo;

    public RepairInterventionService(
            RepairInterventionRepository repairRepo,
            ProgramRepository programRepo,
            ProgramResidentRepository residentRepo,
            UserRepository userRepo) {
        this.repairRepo = repairRepo;
        this.programRepo = programRepo;
        this.residentRepo = residentRepo;
        this.userRepo = userRepo;
    }

    public List<RepairInterventionResponse> getAllRepairInterventions(Long programId) {
        return repairRepo.findByProgram_IdOrderByInfractionDateDescCreatedAtDesc(programId, org.springframework.data.domain.Pageable.unpaged())
                .getContent()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<RepairInterventionResponse> getRepairInterventionById(Long id) {
        return repairRepo.findById(id).map(this::toResponse);
    }

    public List<RepairInterventionResponse> getRepairInterventionsByResident(Long programId, Long residentId) {
        // Get all repairs for this resident in this program, regardless of review status
        return repairRepo.findByProgram_IdAndResident_IdOrderByInfractionDateDesc(programId, residentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RepairInterventionResponse createRepairIntervention(
            Long programId,
            RepairInterventionRequest request,
            String userEmail) {
        
        Program program = programRepo.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        ProgramResident resident = residentRepo.findById(request.getResidentId())
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));

        User assigningStaff = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check for active repairs for this resident
        List<RepairIntervention> activeRepairs = repairRepo.findActiveRepairsByResident(request.getResidentId());
        
        // Determine the repair level based on existing active repairs
        String finalRepairLevel = request.getRepairLevel();
        
        if (!activeRepairs.isEmpty()) {
            // Get the highest active repair level
            RepairIntervention currentRepair = activeRepairs.get(0); // Most recent active repair
            String currentLevel = currentRepair.getRepairLevel();
            
            // Escalate the repair level
            if ("Repair 1".equals(currentLevel)) {
                finalRepairLevel = "Repair 2";
            } else if ("Repair 2".equals(currentLevel)) {
                finalRepairLevel = "Repair 3";
            } else {
                finalRepairLevel = "Repair 3"; // Already at max, stays at R3
            }
            
            // Mark all existing active repairs as superseded/completed
            for (RepairIntervention activeRepair : activeRepairs) {
                activeRepair.setStatus("superseded");
                activeRepair.setRepairEndDate(LocalDate.now().minusDays(1)); // End yesterday
                activeRepair.setUpdatedAt(Instant.now());
                repairRepo.save(activeRepair);
            }
        }

        RepairIntervention repair = new RepairIntervention();
        repair.setProgram(program);
        repair.setResident(resident);
        repair.setInfractionDate(request.getInfractionDate());
        repair.setInfractionShift(request.getInfractionShift());
        repair.setInfractionBehavior(request.getInfractionBehavior());
        repair.setRepairLevel(finalRepairLevel); // Use escalated level
        repair.setInterventionsJson(request.getInterventionsJson());
        repair.setComments(request.getComments());
        repair.setReviewDate(request.getReviewDate());
        
        // Set repair duration and dates based on repair level
        LocalDate startDate = request.getRepairStartDate() != null ? request.getRepairStartDate() : LocalDate.now();
        int durationDays;
        
        switch (finalRepairLevel) {
            case "Repair 1":
                durationDays = 0; // 1 shift (same day)
                break;
            case "Repair 2":
                durationDays = 1; // 1 day
                break;
            case "Repair 3":
                durationDays = 3; // 3 days
                break;
            default:
                durationDays = 0;
        }
        
        repair.setRepairDurationDays(durationDays);
        repair.setRepairStartDate(startDate);
        repair.setRepairEndDate(startDate.plusDays(durationDays));
        repair.setPointsSuspended(request.getPointsSuspended() != null ? request.getPointsSuspended() : true);
        
        // Set assigning staff info
        repair.setAssigningStaffId(assigningStaff.getId());
        String staffName = (assigningStaff.getFirstName() != null ? assigningStaff.getFirstName() : "") + 
                          " " + 
                          (assigningStaff.getLastName() != null ? assigningStaff.getLastName() : "");
        repair.setAssigningStaffName(staffName.trim());
        
        repair.setStatus("pending_review");
        repair.setCreatedAt(Instant.now());
        repair.setUpdatedAt(Instant.now());

        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    @Transactional
    public RepairInterventionResponse approvePD(Long id, RepairReviewRequest request, String userEmail) {
        RepairIntervention repair = repairRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repair intervention not found"));

        User reviewer = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        repair.setReviewedByPdId(reviewer.getId());
        String reviewerName = (reviewer.getFirstName() != null ? reviewer.getFirstName() : "") + 
                             " " + 
                             (reviewer.getLastName() != null ? reviewer.getLastName() : "");
        repair.setReviewedByPdName(reviewerName.trim());
        repair.setReviewedByPdAt(Instant.now());
        repair.setPdReviewStatus(request.getReviewStatus());
        repair.setPdReviewComments(request.getReviewComments());
        repair.setUpdatedAt(Instant.now());

        // Update status if both approvals are done
        if ("approved".equals(request.getReviewStatus()) && 
            "approved".equals(repair.getClinicalReviewStatus())) {
            repair.setStatus("approved");
        }

        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    @Transactional
    public RepairInterventionResponse reviewRepair(Long id, String action, String comments, String userEmail) {
        RepairIntervention repair = repairRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repair not found"));

        User reviewer = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if ("revoke".equalsIgnoreCase(action)) {
            // Revoke the repair - set end date to today
            repair.setRepairEndDate(java.time.LocalDate.now().minusDays(1)); // End yesterday
            repair.setStatus("revoked");
        } else if ("affirm".equalsIgnoreCase(action)) {
            // Affirm the repair - keep it active
            repair.setStatus("approved");
        } else {
            throw new IllegalArgumentException("Invalid action: " + action);
        }

        repair.setUpdatedAt(java.time.Instant.now());
        
        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    @Transactional
    public RepairInterventionResponse approveClinical(Long id, RepairReviewRequest request, String userEmail) {
        RepairIntervention repair = repairRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repair intervention not found"));

        User reviewer = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        repair.setReviewedByClinicalId(reviewer.getId());
        String reviewerName = (reviewer.getFirstName() != null ? reviewer.getFirstName() : "") + 
                             " " + 
                             (reviewer.getLastName() != null ? reviewer.getLastName() : "");
        repair.setReviewedByClinicalName(reviewerName.trim());
        repair.setReviewedByClinicalAt(Instant.now());
        repair.setClinicalReviewStatus(request.getReviewStatus());
        repair.setClinicalReviewComments(request.getReviewComments());
        repair.setUpdatedAt(Instant.now());

        // Update status if both approvals are done
        if ("approved".equals(request.getReviewStatus()) && 
            "approved".equals(repair.getPdReviewStatus())) {
            repair.setStatus("approved");
        }

        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    private RepairInterventionResponse toResponse(RepairIntervention repair) {
        RepairInterventionResponse response = new RepairInterventionResponse();
        response.setId(repair.getId());
        response.setProgramId(repair.getProgram() != null ? repair.getProgram().getId() : null);
        response.setResidentId(repair.getResident() != null ? repair.getResident().getId() : null);
        
        if (repair.getResident() != null) {
            response.setResidentName(repair.getResident().getFullName());
            response.setResidentNumber(repair.getResident().getResidentId());
        }
        
        response.setInfractionDate(repair.getInfractionDate());
        response.setInfractionShift(repair.getInfractionShift());
        response.setInfractionBehavior(repair.getInfractionBehavior());
        response.setAssigningStaffId(repair.getAssigningStaffId());
        response.setAssigningStaffName(repair.getAssigningStaffName());
        response.setRepairLevel(repair.getRepairLevel());
        response.setInterventionsJson(repair.getInterventionsJson());
        response.setComments(repair.getComments());
        response.setReviewDate(repair.getReviewDate());
        response.setReviewedByPdId(repair.getReviewedByPdId());
        response.setReviewedByPdName(repair.getReviewedByPdName());
        response.setReviewedByPdAt(repair.getReviewedByPdAt());
        response.setReviewedByClinicalId(repair.getReviewedByClinicalId());
        response.setReviewedByClinicalName(repair.getReviewedByClinicalName());
        response.setReviewedByClinicalAt(repair.getReviewedByClinicalAt());
        response.setRepairDurationDays(repair.getRepairDurationDays());
        response.setRepairStartDate(repair.getRepairStartDate());
        response.setRepairEndDate(repair.getRepairEndDate());
        response.setPointsSuspended(repair.getPointsSuspended());
        response.setPdReviewStatus(repair.getPdReviewStatus());
        response.setPdReviewComments(repair.getPdReviewComments());
        response.setClinicalReviewStatus(repair.getClinicalReviewStatus());
        response.setClinicalReviewComments(repair.getClinicalReviewComments());
        response.setStatus(repair.getStatus());
        response.setCreatedAt(repair.getCreatedAt());
        response.setUpdatedAt(repair.getUpdatedAt());
        
        return response;
    }

    public List<RepairInterventionResponse> getRepairsByResident(Long residentId) {
        return repairRepo.findByResident_IdOrderByInfractionDateDesc(residentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

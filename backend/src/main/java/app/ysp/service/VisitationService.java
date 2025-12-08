package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.entity.Visitation;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repository.VisitationRepository;
import app.ysp.util.JsonUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import app.ysp.service.SseHub;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VisitationService {

    private final VisitationRepository visitationRepository;
    private final ProgramRepository programRepository;
    private final ProgramResidentRepository residentRepository;
    private final UserRepository userRepository;
    private final SseHub sseHub;

    public VisitationService(VisitationRepository visitationRepository,
                            ProgramRepository programRepository,
                            ProgramResidentRepository residentRepository,
                            UserRepository userRepository,
                            SseHub sseHub) {
        this.visitationRepository = visitationRepository;
        this.programRepository = programRepository;
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.sseHub = sseHub;
    }

    // ============ VISITATION QUERIES ============

    /**
     * Get today's visitations for a program
     */
    public List<Map<String, Object>> getTodaysVisitations(Long programId) {
        LocalDate today = LocalDate.now();
        List<Visitation> visitations = visitationRepository.findTodaysVisitationsByProgram(programId, today);
        return visitations.stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming visitations for a program
     * Also auto-completes expired visits that weren't cancelled
     */
    public List<Map<String, Object>> getUpcomingVisitations(Long programId) {
        LocalDate today = LocalDate.now();
        Instant now = Instant.now();
        List<Visitation> visitations = visitationRepository.findUpcomingVisitations(programId, today);
        
        // Auto-complete expired visits
        for (Visitation v : visitations) {
            if (v.getScheduledEndTime() != null && 
                v.getScheduledEndTime().isBefore(now) && 
                "SCHEDULED".equals(v.getStatus())) {
                // Visit expired and wasn't cancelled - mark as completed
                v.setStatus("COMPLETED");
                if (v.getActualStartTime() == null) {
                    v.setActualStartTime(v.getScheduledStartTime());
                }
                v.setActualEndTime(v.getScheduledEndTime());
                visitationRepository.save(v);
                try {
                    sseHub.broadcast(Map.of(
                        "type", "visitations.auto_completed",
                        "programId", programId,
                        "id", v.getId()
                    ));
                } catch (Exception ignored) {}
            }
        }
        
        // Fetch again to get updated list without expired visits
        visitations = visitationRepository.findUpcomingVisitations(programId, today);
        return visitations.stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all visitations for a program with pagination
     * Also auto-completes expired visits that weren't cancelled
     */
    public Map<String, Object> getAllVisitations(Long programId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Visitation> visitationPage = visitationRepository
                .findByProgram_IdOrderByScheduledDateDescScheduledStartTimeDesc(programId, pageable);
        
        // Auto-complete expired visits
        Instant now = Instant.now();
        for (Visitation v : visitationPage.getContent()) {
            if (v.getScheduledEndTime() != null && 
                v.getScheduledEndTime().isBefore(now) && 
                "SCHEDULED".equals(v.getStatus())) {
                // Visit expired and wasn't cancelled - mark as completed
                v.setStatus("COMPLETED");
                if (v.getActualStartTime() == null) {
                    v.setActualStartTime(v.getScheduledStartTime());
                }
                v.setActualEndTime(v.getScheduledEndTime());
                visitationRepository.save(v);
            }
        }
        
        List<Map<String, Object>> visitations = visitationPage.getContent().stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("visitations", visitations);
        response.put("totalPages", visitationPage.getTotalPages());
        response.put("totalElements", visitationPage.getTotalElements());
        response.put("currentPage", page);
        
        return response;
    }

    /**
     * Get visitation by ID
     */
    public Optional<Map<String, Object>> getVisitationById(Long id) {
        return visitationRepository.findById(id)
                .map(this::mapToVisitationResponse);
    }

    /**
     * Get visitations for a resident
     */
    public List<Map<String, Object>> getResidentVisitations(Long residentId) {
        List<Visitation> visitations = visitationRepository.findByResident_IdOrderByScheduledDateDesc(residentId);
        return visitations.stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get pending approval visitations
     */
    public List<Map<String, Object>> getPendingApprovals(Long programId) {
        List<Visitation> visitations = visitationRepository.findPendingApprovalByProgram(programId);
        return visitations.stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get visitations with incidents
     */
    public List<Map<String, Object>> getVisitationsWithIncidents(Long programId) {
        List<Visitation> visitations = visitationRepository.findVisitationsWithIncidents(programId);
        return visitations.stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search visitations
     */
    public List<Map<String, Object>> searchVisitations(Long programId, String search) {
        List<Visitation> visitations = visitationRepository.searchVisitations(programId, search);
        return visitations.stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filter visitations with complex criteria
     * Also auto-completes expired visits that weren't cancelled
     */
    public Map<String, Object> filterVisitations(Long programId, Long residentId, String visitType,
                                                  String status, String approvalStatus,
                                                  LocalDate startDate, LocalDate endDate,
                                                  int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Visitation> visitationPage = visitationRepository.filterVisitations(
                programId, residentId, visitType, status, approvalStatus, startDate, endDate, pageable);
        
        // Auto-complete expired visits
        Instant now = Instant.now();
        for (Visitation v : visitationPage.getContent()) {
            if (v.getScheduledEndTime() != null && 
                v.getScheduledEndTime().isBefore(now) && 
                "SCHEDULED".equals(v.getStatus())) {
                // Visit expired and wasn't cancelled - mark as completed
                v.setStatus("COMPLETED");
                if (v.getActualStartTime() == null) {
                    v.setActualStartTime(v.getScheduledStartTime());
                }
                v.setActualEndTime(v.getScheduledEndTime());
                visitationRepository.save(v);
            }
        }
        
        List<Map<String, Object>> visitations = visitationPage.getContent().stream()
                .map(this::mapToVisitationResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("visitations", visitations);
        response.put("totalPages", visitationPage.getTotalPages());
        response.put("totalElements", visitationPage.getTotalElements());
        response.put("currentPage", page);
        
        return response;
    }

    /**
     * Get statistics for a program
     */
    public Map<String, Object> getVisitationStatistics(Long programId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        long todaysCount = visitationRepository.countTodaysVisitations(programId, today);
        long pendingCount = visitationRepository.countByProgram_IdAndApprovalStatus(programId, "PENDING");
        long totalCount = visitationRepository.countByProgram_Id(programId);
        
        stats.put("todaysVisitations", todaysCount);
        stats.put("pendingApprovals", pendingCount);
        stats.put("totalVisitations", totalCount);
        
        return stats;
    }

    // ============ VISITATION MUTATIONS ============

    /**
     * Schedule a new visitation
     */
    @Transactional
    public Map<String, Object> scheduleVisitation(Long programId, Map<String, Object> request, String staffEmail) {
        // Validate request
        validateVisitationRequest(request);

        // Get program
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found with id: " + programId));

        // Get resident
        Long residentId = getLong(request, "residentId");
        ProgramResident resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new IllegalArgumentException("Resident not found with id: " + residentId));

        // Verify resident belongs to program
        if (!resident.getProgram().getId().equals(programId)) {
            throw new IllegalArgumentException("Resident does not belong to this program");
        }

        // Get staff
        User staff = userRepository.findByEmailIgnoreCase(staffEmail)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        // Create visitation
        Visitation visitation = new Visitation();
        visitation.setProgram(program);
        visitation.setResident(resident);
        visitation.setVisitType(getString(request, "visitType"));
        visitation.setStatus(getString(request, "status", "SCHEDULED"));
        visitation.setApprovalStatus(getString(request, "approvalStatus", "PENDING"));
        
        // Handle visitor info (convert to JSON)
        if (request.containsKey("visitorInfo")) {
            visitation.setVisitorInfoJson(JsonUtil.serialize(request.get("visitorInfo")));
        }
        
        visitation.setScheduledDate(getLocalDate(request, "scheduledDate"));
        visitation.setScheduledStartTime(getInstant(request, "scheduledStartTime"));
        visitation.setScheduledEndTime(getInstant(request, "scheduledEndTime"));
        visitation.setVisitationRoom(getString(request, "visitationRoom"));
        visitation.setSpecialInstructions(getString(request, "specialInstructions"));
        
        // Set supervising staff if provided (multiple staff members)
        if (request.containsKey("supervisingStaffIds") && request.get("supervisingStaffIds") instanceof java.util.List) {
            @SuppressWarnings("unchecked")
            java.util.List<Integer> staffIds = (java.util.List<Integer>) request.get("supervisingStaffIds");
            java.util.Set<User> supervisingStaffSet = new java.util.HashSet<>();
            for (Integer staffId : staffIds) {
                User supervisingUser = userRepository.findById(staffId.longValue())
                        .orElseThrow(() -> new IllegalArgumentException("Supervising staff not found: " + staffId));
                supervisingStaffSet.add(supervisingUser);
            }
            visitation.setSupervisingStaff(supervisingStaffSet);
        }
        
        visitation.setScheduledByStaff(staff);

        Visitation saved = visitationRepository.save(visitation);
        try { sseHub.broadcast(Map.of("type", "visitations.created", "programId", programId, "id", saved.getId())); } catch (Exception ignored) {}
        return mapToVisitationResponse(saved);
    }

    /**
     * Update visitation status
     */
    @Transactional
    public Map<String, Object> updateVisitationStatus(Long visitationId, String newStatus, String staffEmail) {
        Visitation visitation = visitationRepository.findById(visitationId)
                .orElseThrow(() -> new IllegalArgumentException("Visitation not found with id: " + visitationId));

        if (!List.of("SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW").contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        visitation.setStatus(newStatus);
        
        // Set timestamps for status changes
        if ("IN_PROGRESS".equals(newStatus)) {
            visitation.setActualStartTime(Instant.now());
        } else if ("COMPLETED".equals(newStatus)) {
            if (visitation.getActualStartTime() == null) {
                visitation.setActualStartTime(visitation.getScheduledStartTime());
            }
            visitation.setActualEndTime(Instant.now());
            
            User staff = userRepository.findByEmailIgnoreCase(staffEmail)
                    .orElseThrow(() -> new IllegalArgumentException("Staff not found"));
            visitation.setCompletedByStaff(staff);
        }

        Visitation saved = visitationRepository.save(visitation);
        return mapToVisitationResponse(saved);
    }

    /**
     * Update approval status
     */
    @Transactional
    public Map<String, Object> updateApprovalStatus(Long visitationId, String approvalStatus, 
                                                     String denialReason, String staffEmail) {
        Visitation visitation = visitationRepository.findById(visitationId)
                .orElseThrow(() -> new IllegalArgumentException("Visitation not found with id: " + visitationId));

        if (!List.of("APPROVED", "PENDING", "DENIED").contains(approvalStatus)) {
            throw new IllegalArgumentException("Invalid approval status: " + approvalStatus);
        }

        visitation.setApprovalStatus(approvalStatus);
        
        if ("DENIED".equals(approvalStatus)) {
            if (denialReason == null || denialReason.isBlank()) {
                throw new IllegalArgumentException("Denial reason is required when denying a visitation");
            }
            visitation.setDenialReason(denialReason);
            visitation.setStatus("CANCELLED");
        }

        Visitation saved = visitationRepository.save(visitation);
        try { sseHub.broadcast(Map.of("type", "visitations.approved", "programId", saved.getProgram().getId(), "id", saved.getId())); } catch (Exception ignored) {}
        return mapToVisitationResponse(saved);
    }

    /**
     * Complete visitation with notes
     */
    @Transactional
    public Map<String, Object> completeVisitation(Long visitationId, Map<String, Object> request, String staffEmail) {
        Visitation visitation = visitationRepository.findById(visitationId)
                .orElseThrow(() -> new IllegalArgumentException("Visitation not found with id: " + visitationId));

        User staff = userRepository.findByEmailIgnoreCase(staffEmail)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        visitation.setStatus("COMPLETED");
        visitation.setActualEndTime(Instant.now());
        visitation.setVisitNotes(getString(request, "visitNotes"));
        visitation.setCompletedByStaff(staff);
        
        // Handle incident reporting
        if (request.containsKey("incidentOccurred")) {
            visitation.setIncidentOccurred(getBoolean(request, "incidentOccurred"));
            if (visitation.getIncidentOccurred()) {
                visitation.setIncidentDetails(getString(request, "incidentDetails"));
            }
        }

        Visitation saved = visitationRepository.save(visitation);
        return mapToVisitationResponse(saved);
    }

    /**
     * Cancel a visitation
     */
    @Transactional
    public Map<String, Object> cancelVisitation(Long visitationId) {
        Visitation visitation = visitationRepository.findById(visitationId)
                .orElseThrow(() -> new IllegalArgumentException("Visitation not found with id: " + visitationId));
        
        // Only allow cancellation if not already completed or cancelled
        if ("COMPLETED".equals(visitation.getStatus()) || "CANCELLED".equals(visitation.getStatus())) {
            throw new IllegalArgumentException("Cannot cancel a visit that is already " + visitation.getStatus().toLowerCase());
        }
        
        // Set status to CANCELLED
        visitation.setStatus("CANCELLED");
        visitation.setUpdatedAt(Instant.now());
        
        Visitation saved = visitationRepository.save(visitation);
        try { sseHub.broadcast(Map.of("type", "visitations.cancelled", "programId", saved.getProgram().getId(), "id", saved.getId())); } catch (Exception ignored) {}
        return mapToVisitationResponse(saved);
    }

    /**
     * Delete a visitation (admin only)
     */
    @Transactional
    public void deleteVisitation(Long visitationId) {
        if (!visitationRepository.existsById(visitationId)) {
            throw new IllegalArgumentException("Visitation not found with id: " + visitationId);
        }
        visitationRepository.deleteById(visitationId);
    }

    // ============ VALIDATION ============

    private void validateVisitationRequest(Map<String, Object> request) {
        if (!request.containsKey("residentId")) {
            throw new IllegalArgumentException("Resident ID is required");
        }
        if (!request.containsKey("visitType") || getString(request, "visitType").isBlank()) {
            throw new IllegalArgumentException("Visit type is required");
        }
        if (!List.of("IN_PERSON", "VIDEO", "PROFESSIONAL", "LEGAL").contains(getString(request, "visitType"))) {
            throw new IllegalArgumentException("Invalid visit type");
        }
        if (!request.containsKey("scheduledDate")) {
            throw new IllegalArgumentException("Scheduled date is required");
        }
        if (!request.containsKey("scheduledStartTime")) {
            throw new IllegalArgumentException("Scheduled start time is required");
        }
        if (!request.containsKey("scheduledEndTime")) {
            throw new IllegalArgumentException("Scheduled end time is required");
        }
    }

    // ============ MAPPING ============

    private Map<String, Object> mapToVisitationResponse(Visitation visitation) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", visitation.getId());
        response.put("programId", visitation.getProgram().getId());
        response.put("residentId", visitation.getResident().getId());
        response.put("residentName", visitation.getResident().getFirstName() + " " + visitation.getResident().getLastName());
        response.put("residentNumber", visitation.getResident().getResidentId());
        response.put("visitType", visitation.getVisitType());
        response.put("status", visitation.getStatus());
        response.put("approvalStatus", visitation.getApprovalStatus());
        
        // Parse visitor info JSON
        if (visitation.getVisitorInfoJson() != null) {
            response.put("visitorInfo", JsonUtil.toList(visitation.getVisitorInfoJson()));
        }
        
        response.put("scheduledDate", visitation.getScheduledDate());
        response.put("scheduledStartTime", visitation.getScheduledStartTime());
        response.put("scheduledEndTime", visitation.getScheduledEndTime());
        response.put("actualStartTime", visitation.getActualStartTime());
        response.put("actualEndTime", visitation.getActualEndTime());
        response.put("visitationRoom", visitation.getVisitationRoom());
        response.put("specialInstructions", visitation.getSpecialInstructions());
        
        // Map supervising staff (multiple)
        if (visitation.getSupervisingStaff() != null && !visitation.getSupervisingStaff().isEmpty()) {
            java.util.List<java.util.Map<String, Object>> staffList = new java.util.ArrayList<>();
            for (User staff : visitation.getSupervisingStaff()) {
                java.util.Map<String, Object> staffInfo = new java.util.HashMap<>();
                staffInfo.put("id", staff.getId());
                staffInfo.put("fullName", getFullName(staff));
                staffInfo.put("email", staff.getEmail());
                staffList.add(staffInfo);
            }
            response.put("supervisingStaff", staffList);
            // Also add a concatenated string of names for display
            String staffNames = visitation.getSupervisingStaff().stream()
                    .map(this::getFullName)
                    .collect(java.util.stream.Collectors.joining(", "));
            response.put("supervisingStaffName", staffNames);
        }
        
        response.put("visitNotes", visitation.getVisitNotes());
        response.put("denialReason", visitation.getDenialReason());
        
        if (visitation.getScheduledByStaff() != null) {
            response.put("scheduledByStaffId", visitation.getScheduledByStaff().getId());
            response.put("scheduledByStaffName", getFullName(visitation.getScheduledByStaff()));
        }
        
        if (visitation.getCompletedByStaff() != null) {
            response.put("completedByStaffId", visitation.getCompletedByStaff().getId());
            response.put("completedByStaffName", getFullName(visitation.getCompletedByStaff()));
        }
        
        response.put("incidentOccurred", visitation.getIncidentOccurred());
        response.put("incidentDetails", visitation.getIncidentDetails());
        response.put("createdAt", visitation.getCreatedAt());
        response.put("updatedAt", visitation.getUpdatedAt());
        
        return response;
    }

    // ============ HELPER METHODS ============

    private String getFullName(User user) {
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String lastName = user.getLastName() != null ? user.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? user.getEmail() : fullName;
    }

    private String getString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }

    private String getString(Map<String, Object> map, String key, String defaultValue) {
        Object value = map.get(key);
        return value != null ? value.toString() : defaultValue;
    }

    private Long getLong(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).longValue();
        return Long.parseLong(value.toString());
    }

    private Boolean getBoolean(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Boolean) return (Boolean) value;
        return Boolean.parseBoolean(value.toString());
    }

    private LocalDate getLocalDate(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof LocalDate) return (LocalDate) value;
        return LocalDate.parse(value.toString());
    }

    private Instant getInstant(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Instant) return (Instant) value;
        return Instant.parse(value.toString());
    }
}

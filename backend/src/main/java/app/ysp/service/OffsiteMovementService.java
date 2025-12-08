package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.OffsiteMovementRequest;
import app.ysp.dto.OffsiteMovementResponse;
import app.ysp.dto.MovementUpdateRequest;
import app.ysp.entity.OffsiteMovement;
import app.ysp.entity.MovementStaffAssignment;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.repository.OffsiteMovementRepository;
import app.ysp.repository.MovementStaffAssignmentRepository;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repo.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OffsiteMovementService {
    
    private final OffsiteMovementRepository movementRepository;
    private final MovementStaffAssignmentRepository assignmentRepository;
    private final ProgramRepository programRepository;
    private final ProgramResidentRepository residentRepository;
    private final UserRepository userRepository;
    private final SseHub sseHub;
    
    public OffsiteMovementService(
            OffsiteMovementRepository movementRepository,
            MovementStaffAssignmentRepository assignmentRepository,
            ProgramRepository programRepository,
            ProgramResidentRepository residentRepository,
            UserRepository userRepository,
            SseHub sseHub) {
        this.movementRepository = movementRepository;
        this.assignmentRepository = assignmentRepository;
        this.programRepository = programRepository;
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
        this.sseHub = sseHub;
    }
    
    /**
     * Schedule a new off-site movement
     */
    @Transactional
    public OffsiteMovementResponse scheduleMovement(Long programId, OffsiteMovementRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        ProgramResident resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        User schedulingStaff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        // Validate minimum staff requirement
        if (request.getStaffAssignments() == null || request.getStaffAssignments().size() < 2) {
            throw new RuntimeException("Minimum 2 staff members required for off-site movements");
        }
        
        OffsiteMovement movement = new OffsiteMovement();
        movement.setProgram(program);
        movement.setResident(resident);
        movement.setMovementType(request.getMovementType());
        movement.setMovementDate(request.getMovementDate());
        movement.setMovementTime(request.getMovementTime());
        movement.setDestination(request.getDestination());
        movement.setDestinationAddress(request.getDestinationAddress());
        movement.setDestinationContact(request.getDestinationContact());
        movement.setEstimatedDuration(request.getEstimatedDuration());
        movement.setPriorityLevel(request.getPriorityLevel() != null ? request.getPriorityLevel() : "ROUTINE");
        movement.setStatus("SCHEDULED");
        movement.setRequiresRestraints(request.getRequiresRestraints() != null ? request.getRequiresRestraints() : false);
        movement.setWheelchairAccessible(request.getWheelchairAccessible() != null ? request.getWheelchairAccessible() : false);
        movement.setMedicalEquipmentNeeded(request.getMedicalEquipmentNeeded() != null ? request.getMedicalEquipmentNeeded() : false);
        movement.setBehavioralPrecautions(request.getBehavioralPrecautions() != null ? request.getBehavioralPrecautions() : false);
        movement.setMovementNotes(request.getMovementNotes());
        movement.setScheduledByStaff(schedulingStaff);
        
        OffsiteMovement saved = movementRepository.save(movement);
        
        // Assign staff
        for (OffsiteMovementRequest.StaffAssignmentRequest assignment : request.getStaffAssignments()) {
            User staff = userRepository.findById(assignment.getStaffId())
                    .orElseThrow(() -> new RuntimeException("Staff member not found: " + assignment.getStaffId()));
            
            MovementStaffAssignment staffAssignment = new MovementStaffAssignment();
            staffAssignment.setMovement(saved);
            staffAssignment.setStaff(staff);
            staffAssignment.setAssignmentRole(assignment.getAssignmentRole() != null ? assignment.getAssignmentRole() : "PRIMARY");
            staffAssignment.setAssignedByStaff(schedulingStaff);
            assignmentRepository.save(staffAssignment);
        }
        
        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "movement_scheduled",
                "programId", programId,
                "movementId", saved.getId(),
                "priorityLevel", saved.getPriorityLevel()
        ));
        
        return mapToResponse(saved);
    }
    
    /**
     * Start a movement (change status to IN_PROGRESS)
     */
    @Transactional
    public OffsiteMovementResponse startMovement(Long movementId, Long staffId) {
        OffsiteMovement movement = movementRepository.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Movement not found"));
        
        if (!"SCHEDULED".equals(movement.getStatus())) {
            throw new RuntimeException("Movement must be in SCHEDULED status to start");
        }
        
        movement.setStatus("IN_PROGRESS");
        movement.setActualStartTime(Instant.now());
        
        OffsiteMovement saved = movementRepository.save(movement);
        
        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "movement_started",
                "programId", saved.getProgram().getId(),
                "movementId", saved.getId()
        ));
        
        return mapToResponse(saved);
    }
    
    /**
     * Complete a movement
     */
    @Transactional
    public OffsiteMovementResponse completeMovement(Long movementId, MovementUpdateRequest request, Long staffId) {
        OffsiteMovement movement = movementRepository.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Movement not found"));
        User completingStaff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        if (!"IN_PROGRESS".equals(movement.getStatus()) && !"SCHEDULED".equals(movement.getStatus())) {
            throw new RuntimeException("Movement must be in IN_PROGRESS or SCHEDULED status to complete");
        }
        
        movement.setStatus("COMPLETED");
        movement.setActualEndTime(Instant.now());
        movement.setActualDuration(request.getActualDuration());
        movement.setOutcomeNotes(request.getOutcomeNotes());
        movement.setCompletedByStaff(completingStaff);
        
        OffsiteMovement saved = movementRepository.save(movement);
        
        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "movement_completed",
                "programId", saved.getProgram().getId(),
                "movementId", saved.getId()
        ));
        
        return mapToResponse(saved);
    }
    
    /**
     * Cancel a movement
     */
    @Transactional
    public OffsiteMovementResponse cancelMovement(Long movementId, String reason, Long staffId) {
        OffsiteMovement movement = movementRepository.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Movement not found"));
        User cancellingStaff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        if ("COMPLETED".equals(movement.getStatus()) || "CANCELLED".equals(movement.getStatus())) {
            throw new RuntimeException("Cannot cancel a movement that is already completed or cancelled");
        }
        
        movement.setStatus("CANCELLED");
        movement.setCancellationReason(reason);
        movement.setCancelledByStaff(cancellingStaff);
        
        OffsiteMovement saved = movementRepository.save(movement);
        
        // Send SSE notification
        sseHub.broadcast(Map.of(
                "type", "movement_cancelled",
                "programId", saved.getProgram().getId(),
                "movementId", saved.getId()
        ));
        
        return mapToResponse(saved);
    }
    
    /**
     * Get scheduled movements for a program
     */
    public List<OffsiteMovementResponse> getScheduledMovements(Long programId) {
        List<OffsiteMovement> movements = movementRepository
                .findByProgram_IdAndStatusOrderByMovementDateAscMovementTimeAsc(programId, "SCHEDULED");
        return movements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get today's movements
     */
    public List<OffsiteMovementResponse> getTodaysMovements(Long programId) {
        List<OffsiteMovement> movements = movementRepository
                .findTodaysMovements(programId, LocalDate.now());
        return movements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get urgent movements
     */
    public List<OffsiteMovementResponse> getUrgentMovements(Long programId) {
        List<OffsiteMovement> movements = movementRepository
                .findByProgram_IdAndPriorityLevelInAndStatusOrderByMovementDateAscMovementTimeAsc(
                        programId, List.of("URGENT", "EMERGENCY"), "SCHEDULED");
        return movements.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get movements archive with filters and pagination
     */
    public Map<String, Object> getMovementsArchive(Long programId, Long residentId, String status,
                                                    String movementType, LocalDate startDate, LocalDate endDate,
                                                    int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OffsiteMovement> movementPage = movementRepository
                .filterMovements(programId, residentId, status, movementType, startDate, endDate, pageable);
        
        List<OffsiteMovementResponse> movements = movementPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", movements);
        response.put("totalPages", movementPage.getTotalPages());
        response.put("totalElements", movementPage.getTotalElements());
        response.put("currentPage", movementPage.getNumber());
        return response;
    }
    
    /**
     * Get a single movement by ID
     */
    public OffsiteMovementResponse getMovementById(Long movementId) {
        OffsiteMovement movement = movementRepository.findById(movementId)
                .orElseThrow(() -> new RuntimeException("Movement not found"));
        return mapToResponse(movement);
    }
    
    /**
     * Map entity to response DTO
     */
    private OffsiteMovementResponse mapToResponse(OffsiteMovement movement) {
        OffsiteMovementResponse response = new OffsiteMovementResponse();
        response.setId(movement.getId());
        response.setProgramId(movement.getProgram().getId());
        response.setResidentId(movement.getResident().getId());
        response.setResidentName(movement.getResident().getFirstName() + " " + movement.getResident().getLastName());
        response.setResidentNumber(movement.getResident().getResidentId());
        response.setMovementType(movement.getMovementType());
        response.setMovementDate(movement.getMovementDate());
        response.setMovementTime(movement.getMovementTime());
        response.setDestination(movement.getDestination());
        response.setDestinationAddress(movement.getDestinationAddress());
        response.setDestinationContact(movement.getDestinationContact());
        response.setEstimatedDuration(movement.getEstimatedDuration());
        response.setPriorityLevel(movement.getPriorityLevel());
        response.setStatus(movement.getStatus());
        response.setActualStartTime(movement.getActualStartTime());
        response.setActualEndTime(movement.getActualEndTime());
        response.setActualDuration(movement.getActualDuration());
        response.setRequiresRestraints(movement.getRequiresRestraints());
        response.setWheelchairAccessible(movement.getWheelchairAccessible());
        response.setMedicalEquipmentNeeded(movement.getMedicalEquipmentNeeded());
        response.setBehavioralPrecautions(movement.getBehavioralPrecautions());
        response.setMovementNotes(movement.getMovementNotes());
        response.setOutcomeNotes(movement.getOutcomeNotes());
        response.setCancellationReason(movement.getCancellationReason());
        response.setScheduledByStaffId(movement.getScheduledByStaff().getId());
        response.setScheduledByStaffName(movement.getScheduledByStaff().getFirstName() + " " + movement.getScheduledByStaff().getLastName());
        
        if (movement.getCompletedByStaff() != null) {
            response.setCompletedByStaffId(movement.getCompletedByStaff().getId());
            response.setCompletedByStaffName(movement.getCompletedByStaff().getFirstName() + " " + movement.getCompletedByStaff().getLastName());
        }
        
        if (movement.getCancelledByStaff() != null) {
            response.setCancelledByStaffId(movement.getCancelledByStaff().getId());
            response.setCancelledByStaffName(movement.getCancelledByStaff().getFirstName() + " " + movement.getCancelledByStaff().getLastName());
        }
        
        // Get staff assignments
        List<MovementStaffAssignment> assignments = assignmentRepository.findByMovement_Id(movement.getId());
        List<OffsiteMovementResponse.StaffAssignmentResponse> staffResponses = assignments.stream()
                .map(assignment -> {
                    OffsiteMovementResponse.StaffAssignmentResponse staffResponse = new OffsiteMovementResponse.StaffAssignmentResponse();
                    staffResponse.setStaffId(assignment.getStaff().getId());
                    staffResponse.setStaffName(assignment.getStaff().getFirstName() + " " + assignment.getStaff().getLastName());
                    staffResponse.setAssignmentRole(assignment.getAssignmentRole());
                    staffResponse.setAssignedAt(assignment.getAssignedAt());
                    return staffResponse;
                })
                .collect(Collectors.toList());
        response.setStaffAssignments(staffResponses);
        
        response.setCreatedAt(movement.getCreatedAt());
        response.setUpdatedAt(movement.getUpdatedAt());
        return response;
    }
}

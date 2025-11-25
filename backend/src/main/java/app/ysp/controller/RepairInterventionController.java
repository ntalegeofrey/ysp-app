package app.ysp.controller;

import app.ysp.dto.RepairInterventionRequest;
import app.ysp.dto.RepairInterventionResponse;
import app.ysp.dto.RepairReviewRequest;
import app.ysp.entity.ProgramAssignment;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.service.RepairInterventionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/programs/{programId}/repairs")
public class RepairInterventionController {

    private final RepairInterventionService repairService;
    private final ProgramAssignmentRepository assignmentRepo;

    public RepairInterventionController(
            RepairInterventionService repairService,
            ProgramAssignmentRepository assignmentRepo) {
        this.repairService = repairService;
        this.assignmentRepo = assignmentRepo;
    }

    @GetMapping("/interventions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RepairInterventionResponse>> getRepairInterventions(
            @PathVariable Long programId) {
        List<RepairInterventionResponse> repairs = repairService.getAllRepairInterventions(programId);
        return ResponseEntity.ok(repairs);
    }

    @GetMapping("/interventions/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<RepairInterventionResponse> getRepairIntervention(
            @PathVariable Long programId,
            @PathVariable Long id) {
        return repairService.getRepairInterventionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/interventions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createRepairIntervention(
            @PathVariable Long programId,
            @RequestBody RepairInterventionRequest request,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            RepairInterventionResponse response = repairService.createRepairIntervention(
                    programId, request, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/interventions/{id}/approve-pd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> approvePD(
            @PathVariable Long programId,
            @PathVariable Long id,
            @RequestBody RepairReviewRequest request,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            RepairInterventionResponse response = repairService.approvePD(id, request, userEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/interventions/{id}/approve-clinical")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> approveClinical(
            @PathVariable Long programId,
            @PathVariable Long id,
            @RequestBody RepairReviewRequest request,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            RepairInterventionResponse response = repairService.approveClinical(id, request, userEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get staff by role type for approval sections
    @GetMapping("/staff-by-role/{roleType}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getStaffByRole(
            @PathVariable Long programId,
            @PathVariable String roleType) {
        List<ProgramAssignment> assignments = assignmentRepo.findByProgram_Id(programId);
        
        List<Map<String, Object>> staffList = assignments.stream()
                .filter(pa -> roleType.equalsIgnoreCase(pa.getRoleType()) || 
                             ("CLINICAL".equalsIgnoreCase(roleType) && "Clinical".equalsIgnoreCase(pa.getCategory())))
                .map(pa -> {
                    Map<String, Object> staff = new HashMap<>();
                    staff.put("id", pa.getUserId());
                    staff.put("firstName", pa.getFirstName());
                    staff.put("lastName", pa.getLastName());
                    staff.put("fullName", 
                        (pa.getFirstName() != null ? pa.getFirstName() : "") + " " + 
                        (pa.getLastName() != null ? pa.getLastName() : ""));
                    staff.put("roleType", pa.getRoleType());
                    staff.put("category", pa.getCategory());
                    staff.put("title", pa.getTitle());
                    return staff;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(staffList);
    }
}

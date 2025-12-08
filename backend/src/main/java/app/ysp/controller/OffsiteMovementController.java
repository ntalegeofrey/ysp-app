package app.ysp.controller;

import app.ysp.domain.User;
import app.ysp.dto.OffsiteMovementRequest;
import app.ysp.dto.OffsiteMovementResponse;
import app.ysp.dto.MovementUpdateRequest;
import app.ysp.repo.UserRepository;
import app.ysp.service.OffsiteMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs/{programId}/movements")
public class OffsiteMovementController {
    
    private final OffsiteMovementService movementService;
    private final UserRepository userRepository;
    
    public OffsiteMovementController(OffsiteMovementService movementService, UserRepository userRepository) {
        this.movementService = movementService;
        this.userRepository = userRepository;
    }
    
    /**
     * Schedule a new off-site movement
     * POST /programs/{programId}/movements
     */
    @PostMapping
    public ResponseEntity<OffsiteMovementResponse> scheduleMovement(
            @PathVariable Long programId,
            @RequestBody OffsiteMovementRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        OffsiteMovementResponse response = movementService.scheduleMovement(programId, request, staffId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get scheduled movements for a program
     * GET /programs/{programId}/movements/scheduled
     */
    @GetMapping("/scheduled")
    public ResponseEntity<List<OffsiteMovementResponse>> getScheduledMovements(@PathVariable Long programId) {
        List<OffsiteMovementResponse> movements = movementService.getScheduledMovements(programId);
        return ResponseEntity.ok(movements);
    }
    
    /**
     * Get today's movements
     * GET /programs/{programId}/movements/today
     */
    @GetMapping("/today")
    public ResponseEntity<List<OffsiteMovementResponse>> getTodaysMovements(@PathVariable Long programId) {
        List<OffsiteMovementResponse> movements = movementService.getTodaysMovements(programId);
        return ResponseEntity.ok(movements);
    }
    
    /**
     * Get urgent movements
     * GET /programs/{programId}/movements/urgent
     */
    @GetMapping("/urgent")
    public ResponseEntity<List<OffsiteMovementResponse>> getUrgentMovements(@PathVariable Long programId) {
        List<OffsiteMovementResponse> movements = movementService.getUrgentMovements(programId);
        return ResponseEntity.ok(movements);
    }
    
    /**
     * Get movements archive with filters and pagination
     * GET /programs/{programId}/movements/archive
     */
    @GetMapping("/archive")
    public ResponseEntity<Map<String, Object>> getMovementsArchive(
            @PathVariable Long programId,
            @RequestParam(required = false) Long residentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String movementType,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Map<String, Object> response = movementService.getMovementsArchive(
                programId, residentId, status, movementType, startDate, endDate, page, size);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get a single movement by ID
     * GET /programs/{programId}/movements/{movementId}
     */
    @GetMapping("/{movementId}")
    public ResponseEntity<OffsiteMovementResponse> getMovementById(
            @PathVariable Long programId,
            @PathVariable Long movementId) {
        OffsiteMovementResponse response = movementService.getMovementById(movementId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Start a movement (change to IN_PROGRESS)
     * PATCH /programs/{programId}/movements/{movementId}/start
     */
    @PatchMapping("/{movementId}/start")
    public ResponseEntity<OffsiteMovementResponse> startMovement(
            @PathVariable Long programId,
            @PathVariable Long movementId,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        OffsiteMovementResponse response = movementService.startMovement(movementId, staffId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Complete a movement
     * PATCH /programs/{programId}/movements/{movementId}/complete
     */
    @PatchMapping("/{movementId}/complete")
    public ResponseEntity<OffsiteMovementResponse> completeMovement(
            @PathVariable Long programId,
            @PathVariable Long movementId,
            @RequestBody MovementUpdateRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        OffsiteMovementResponse response = movementService.completeMovement(movementId, request, staffId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cancel a movement
     * PATCH /programs/{programId}/movements/{movementId}/cancel
     */
    @PatchMapping("/{movementId}/cancel")
    public ResponseEntity<OffsiteMovementResponse> cancelMovement(
            @PathVariable Long programId,
            @PathVariable Long movementId,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        String reason = request.get("reason");
        OffsiteMovementResponse response = movementService.cancelMovement(movementId, reason, staffId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Helper method to extract staff ID from authentication
     */
    private Long getStaffIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Authentication required");
        }
        
        try {
            // Try to get ID from principal if it's a Map
            if (authentication.getPrincipal() instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
                Object idObj = principal.get("id");
                if (idObj instanceof Number) {
                    return ((Number) idObj).longValue();
                } else if (idObj instanceof String) {
                    return Long.parseLong((String) idObj);
                }
            }
            
            // If not in principal, authentication.getName() returns email - look up user
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            return user.getId();
        } catch (NumberFormatException e) {
            // If we get a number format exception, try to look up by email
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            return user.getId();
        } catch (Exception e) {
            throw new RuntimeException("Unable to extract staff ID from authentication", e);
        }
    }
}

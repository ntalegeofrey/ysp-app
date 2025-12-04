package app.ysp.controller;

import app.ysp.service.VisitationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs/{programId}/visitations")
public class VisitationController {

    private final VisitationService visitationService;

    public VisitationController(VisitationService visitationService) {
        this.visitationService = visitationService;
    }

    // ============ VISITATION QUERIES ============

    /**
     * Get today's visitations for a program
     */
    @GetMapping("/today")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getTodaysVisitations(@PathVariable Long programId) {
        List<Map<String, Object>> visitations = visitationService.getTodaysVisitations(programId);
        return ResponseEntity.ok(visitations);
    }

    /**
     * Get upcoming visitations for a program
     */
    @GetMapping("/upcoming")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingVisitations(@PathVariable Long programId) {
        List<Map<String, Object>> visitations = visitationService.getUpcomingVisitations(programId);
        return ResponseEntity.ok(visitations);
    }

    /**
     * Get all visitations for a program with pagination
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAllVisitations(
            @PathVariable Long programId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> response = visitationService.getAllVisitations(programId, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get visitation by ID
     */
    @GetMapping("/{visitationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getVisitationById(
            @PathVariable Long programId,
            @PathVariable Long visitationId) {
        return visitationService.getVisitationById(visitationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get pending approval visitations
     */
    @GetMapping("/pending-approvals")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getPendingApprovals(@PathVariable Long programId) {
        List<Map<String, Object>> visitations = visitationService.getPendingApprovals(programId);
        return ResponseEntity.ok(visitations);
    }

    /**
     * Get visitations with incidents
     */
    @GetMapping("/with-incidents")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getVisitationsWithIncidents(@PathVariable Long programId) {
        List<Map<String, Object>> visitations = visitationService.getVisitationsWithIncidents(programId);
        return ResponseEntity.ok(visitations);
    }

    /**
     * Search visitations
     */
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> searchVisitations(
            @PathVariable Long programId,
            @RequestParam String q) {
        List<Map<String, Object>> visitations = visitationService.searchVisitations(programId, q);
        return ResponseEntity.ok(visitations);
    }

    /**
     * Filter visitations with complex criteria
     */
    @GetMapping("/filter")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> filterVisitations(
            @PathVariable Long programId,
            @RequestParam(required = false) Long residentId,
            @RequestParam(required = false) String visitType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String approvalStatus,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> response = visitationService.filterVisitations(
                programId, residentId, visitType, status, approvalStatus, startDate, endDate, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get statistics for a program
     */
    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getVisitationStatistics(@PathVariable Long programId) {
        Map<String, Object> stats = visitationService.getVisitationStatistics(programId);
        return ResponseEntity.ok(stats);
    }

    // ============ RESIDENT-SPECIFIC ENDPOINTS ============

    /**
     * Get visitations for a resident
     */
    @GetMapping("/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getResidentVisitations(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<Map<String, Object>> visitations = visitationService.getResidentVisitations(residentId);
        return ResponseEntity.ok(visitations);
    }

    // ============ VISITATION MUTATIONS ============

    /**
     * Schedule a new visitation
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> scheduleVisitation(
            @PathVariable Long programId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            Map<String, Object> response = visitationService.scheduleVisitation(programId, request, staffEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error scheduling visitation: " + e.getMessage());
        }
    }

    /**
     * Update visitation status
     */
    @PatchMapping("/{visitationId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateVisitationStatus(
            @PathVariable Long programId,
            @PathVariable Long visitationId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            String newStatus = (String) request.get("status");
            Map<String, Object> response = visitationService.updateVisitationStatus(visitationId, newStatus, staffEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating visitation status: " + e.getMessage());
        }
    }

    /**
     * Update approval status
     */
    @PatchMapping("/{visitationId}/approval")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateApprovalStatus(
            @PathVariable Long programId,
            @PathVariable Long visitationId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            String approvalStatus = (String) request.get("approvalStatus");
            String denialReason = (String) request.get("denialReason");
            Map<String, Object> response = visitationService.updateApprovalStatus(
                    visitationId, approvalStatus, denialReason, staffEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating approval status: " + e.getMessage());
        }
    }

    /**
     * Complete visitation with notes
     */
    @PostMapping("/{visitationId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> completeVisitation(
            @PathVariable Long programId,
            @PathVariable Long visitationId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            Map<String, Object> response = visitationService.completeVisitation(visitationId, request, staffEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error completing visitation: " + e.getMessage());
        }
    }

    /**
     * Delete a visitation (admin only)
     */
    @DeleteMapping("/{visitationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVisitation(
            @PathVariable Long programId,
            @PathVariable Long visitationId) {
        try {
            visitationService.deleteVisitation(visitationId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting visitation: " + e.getMessage());
        }
    }
}

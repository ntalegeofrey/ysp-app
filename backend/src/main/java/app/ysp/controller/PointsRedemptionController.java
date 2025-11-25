package app.ysp.controller;

import app.ysp.dto.PointsRedemptionRequest;
import app.ysp.dto.PointsRedemptionResponse;
import app.ysp.service.PointsRedemptionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs/{programId}/redemptions")
public class PointsRedemptionController {

    private final PointsRedemptionService redemptionService;

    public PointsRedemptionController(PointsRedemptionService redemptionService) {
        this.redemptionService = redemptionService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PointsRedemptionResponse>> getRedemptionsByProgram(
            @PathVariable Long programId) {
        List<PointsRedemptionResponse> redemptions = redemptionService.getRedemptionsByProgram(programId);
        return ResponseEntity.ok(redemptions);
    }

    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PointsRedemptionResponse>> getPendingRedemptions(
            @PathVariable Long programId) {
        List<PointsRedemptionResponse> redemptions = redemptionService.getPendingRedemptions(programId);
        return ResponseEntity.ok(redemptions);
    }

    @GetMapping("/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PointsRedemptionResponse>> getRedemptionsByResident(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<PointsRedemptionResponse> redemptions = redemptionService.getRedemptionsByResident(residentId);
        return ResponseEntity.ok(redemptions);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitRedemption(
            @PathVariable Long programId,
            @RequestBody PointsRedemptionRequest request) {
        try {
            PointsRedemptionResponse response = redemptionService.submitRedemption(programId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{redemptionId}/approve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> approveRedemption(
            @PathVariable Long programId,
            @PathVariable Long redemptionId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            String comments = body.getOrDefault("comments", "");
            PointsRedemptionResponse response = redemptionService.approveRedemption(
                    redemptionId, comments, userEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{redemptionId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> rejectRedemption(
            @PathVariable Long programId,
            @PathVariable Long redemptionId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        try {
            String userEmail = auth.getName();
            String comments = body.getOrDefault("comments", "");
            PointsRedemptionResponse response = redemptionService.rejectRedemption(
                    redemptionId, comments, userEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package app.ysp.controller;

import app.ysp.dto.PointsDiaryCardRequest;
import app.ysp.dto.PointsDiaryCardResponse;
import app.ysp.service.PointsManagementService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programs/{programId}/points")
public class PointsManagementController {

    private final PointsManagementService pointsService;

    public PointsManagementController(PointsManagementService pointsService) {
        this.pointsService = pointsService;
    }

    @GetMapping("/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PointsDiaryCardResponse>> getDiaryCardsByResident(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<PointsDiaryCardResponse> cards = pointsService.getDiaryCardsByResident(residentId);
        return ResponseEntity.ok(cards);
    }

    @GetMapping("/resident/{residentId}/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PointsDiaryCardResponse> getCurrentWeekDiaryCard(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        return pointsService.getCurrentWeekDiaryCard(residentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createOrUpdateDiaryCard(
            @PathVariable Long programId,
            @PathVariable Long residentId,
            @RequestBody PointsDiaryCardRequest request) {
        try {
            request.setResidentId(residentId);
            PointsDiaryCardResponse response = pointsService.createOrUpdateDiaryCard(programId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cards/{cardId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateDailyPoints(
            @PathVariable Long programId,
            @PathVariable Long cardId,
            @RequestBody PointsDiaryCardRequest request) {
        try {
            PointsDiaryCardResponse response = pointsService.updateDailyPoints(cardId, request.getDailyPointsJson());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

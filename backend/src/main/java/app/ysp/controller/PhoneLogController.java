package app.ysp.controller;

import app.ysp.service.PhoneLogService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs/{programId}/phone-logs")
public class PhoneLogController {

    private final PhoneLogService phoneLogService;

    public PhoneLogController(PhoneLogService phoneLogService) {
        this.phoneLogService = phoneLogService;
    }

    // ============ PHONE LOG QUERIES ============

    /**
     * Get today's phone logs for a program
     */
    @GetMapping("/today")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getTodaysPhoneLogs(@PathVariable Long programId) {
        List<Map<String, Object>> logs = phoneLogService.getTodaysPhoneLogs(programId);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get recent phone logs (last N days)
     */
    @GetMapping("/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getRecentPhoneLogs(
            @PathVariable Long programId,
            @RequestParam(defaultValue = "7") int days) {
        List<Map<String, Object>> logs = phoneLogService.getRecentPhoneLogs(programId, days);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get all phone logs for a program with pagination
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAllPhoneLogs(
            @PathVariable Long programId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> response = phoneLogService.getAllPhoneLogs(programId, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get phone log by ID
     */
    @GetMapping("/{phoneLogId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getPhoneLogById(
            @PathVariable Long programId,
            @PathVariable Long phoneLogId) {
        return phoneLogService.getPhoneLogById(phoneLogId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get phone logs by call type
     */
    @GetMapping("/by-type/{callType}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getPhoneLogsByType(
            @PathVariable Long programId,
            @PathVariable String callType) {
        List<Map<String, Object>> logs = phoneLogService.getPhoneLogsByType(programId, callType);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get phone logs with concerning behavior
     */
    @GetMapping("/concerning-behavior")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getLogsWithConcerningBehavior(@PathVariable Long programId) {
        List<Map<String, Object>> logs = phoneLogService.getLogsWithConcerningBehavior(programId);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get terminated calls
     */
    @GetMapping("/terminated")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getTerminatedCalls(@PathVariable Long programId) {
        List<Map<String, Object>> logs = phoneLogService.getTerminatedCalls(programId);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get emergency calls
     */
    @GetMapping("/emergency")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getEmergencyCalls(@PathVariable Long programId) {
        List<Map<String, Object>> logs = phoneLogService.getEmergencyCalls(programId);
        return ResponseEntity.ok(logs);
    }

    /**
     * Search phone logs
     */
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> searchPhoneLogs(
            @PathVariable Long programId,
            @RequestParam String q) {
        List<Map<String, Object>> logs = phoneLogService.searchPhoneLogs(programId, q);
        return ResponseEntity.ok(logs);
    }

    /**
     * Filter phone logs with complex criteria
     */
    @GetMapping("/filter")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> filterPhoneLogs(
            @PathVariable Long programId,
            @RequestParam(required = false) Long residentId,
            @RequestParam(required = false) String callType,
            @RequestParam(required = false) String contactRelationship,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endTime,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> response = phoneLogService.filterPhoneLogs(
                programId, residentId, callType, contactRelationship, startTime, endTime, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get statistics for a program
     */
    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getPhoneLogStatistics(@PathVariable Long programId) {
        Map<String, Object> stats = phoneLogService.getPhoneLogStatistics(programId);
        return ResponseEntity.ok(stats);
    }

    // ============ RESIDENT-SPECIFIC ENDPOINTS ============

    /**
     * Get phone logs for a resident
     */
    @GetMapping("/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Map<String, Object>>> getResidentPhoneLogs(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<Map<String, Object>> logs = phoneLogService.getResidentPhoneLogs(residentId);
        return ResponseEntity.ok(logs);
    }

    // ============ PHONE LOG MUTATIONS ============

    /**
     * Create a new phone log entry
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createPhoneLog(
            @PathVariable Long programId,
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            Map<String, Object> response = phoneLogService.createPhoneLog(programId, request, staffEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Update phone log
     */
    @PatchMapping("/{phoneLogId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePhoneLog(
            @PathVariable Long programId,
            @PathVariable Long phoneLogId,
            @RequestBody Map<String, Object> request) {
        try {
            Map<String, Object> response = phoneLogService.updatePhoneLog(phoneLogId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Delete a phone log (admin only)
     */
    @DeleteMapping("/{phoneLogId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePhoneLog(
            @PathVariable Long programId,
            @PathVariable Long phoneLogId) {
        try {
            phoneLogService.deletePhoneLog(phoneLogId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

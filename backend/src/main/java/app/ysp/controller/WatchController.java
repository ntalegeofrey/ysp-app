package app.ysp.controller;

import app.ysp.dto.EndWatchRequest;
import app.ysp.dto.WatchAssignmentRequest;
import app.ysp.dto.WatchAssignmentResponse;
import app.ysp.dto.WatchLogEntryRequest;
import app.ysp.dto.WatchLogEntryResponse;
import app.ysp.service.WatchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs/{programId}/watches")
public class WatchController {

    private final WatchService watchService;

    public WatchController(WatchService watchService) {
        this.watchService = watchService;
    }

    // ============ WATCH ASSIGNMENTS ============

    /**
     * Get all active watches for a program
     */
    @GetMapping("/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchAssignmentResponse>> getActiveWatches(@PathVariable Long programId) {
        List<WatchAssignmentResponse> watches = watchService.getActiveWatches(programId);
        return ResponseEntity.ok(watches);
    }

    /**
     * Get all watches (including archived) for a program
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchAssignmentResponse>> getAllWatches(@PathVariable Long programId) {
        List<WatchAssignmentResponse> watches = watchService.getAllWatches(programId);
        return ResponseEntity.ok(watches);
    }

    /**
     * Get archived watches for a program
     */
    @GetMapping("/archive")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchAssignmentResponse>> getArchivedWatches(@PathVariable Long programId) {
        List<WatchAssignmentResponse> watches = watchService.getArchivedWatches(programId);
        return ResponseEntity.ok(watches);
    }

    /**
     * Get watch by ID
     */
    @GetMapping("/{watchId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WatchAssignmentResponse> getWatchById(
            @PathVariable Long programId,
            @PathVariable Long watchId) {
        return watchService.getWatchById(watchId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get watch statistics for a program
     */
    @GetMapping("/statistics")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getWatchStatistics(@PathVariable Long programId) {
        Map<String, Object> stats = watchService.getWatchStatistics(programId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Create a new watch assignment (clinician only)
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createWatch(
            @PathVariable Long programId,
            @RequestBody WatchAssignmentRequest request,
            Authentication auth) {
        try {
            String clinicianEmail = auth.getName();
            WatchAssignmentResponse response = watchService.createWatch(programId, request, clinicianEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * End a watch assignment
     */
    @PostMapping("/{watchId}/end")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> endWatch(
            @PathVariable Long programId,
            @PathVariable Long watchId,
            @RequestBody EndWatchRequest request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            WatchAssignmentResponse response = watchService.endWatch(watchId, request, staffEmail);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ============ RESIDENT-SPECIFIC ENDPOINTS ============

    /**
     * Get current active watch for a resident
     */
    @GetMapping("/resident/{residentId}/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<WatchAssignmentResponse> getCurrentWatchForResident(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        return watchService.getCurrentWatchForResident(residentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get watch history for a resident
     */
    @GetMapping("/resident/{residentId}/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchAssignmentResponse>> getResidentWatchHistory(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<WatchAssignmentResponse> history = watchService.getResidentWatchHistory(residentId);
        return ResponseEntity.ok(history);
    }

    // ============ WATCH LOG ENTRIES ============

    /**
     * Get all log entries for a watch
     */
    @GetMapping("/{watchId}/log-entries")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchLogEntryResponse>> getLogEntries(
            @PathVariable Long programId,
            @PathVariable Long watchId) {
        List<WatchLogEntryResponse> entries = watchService.getLogEntries(watchId);
        return ResponseEntity.ok(entries);
    }

    /**
     * Get recent log entries (last 6 hours) for a watch
     */
    @GetMapping("/{watchId}/log-entries/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchLogEntryResponse>> getRecentLogEntries(
            @PathVariable Long programId,
            @PathVariable Long watchId) {
        List<WatchLogEntryResponse> entries = watchService.getRecentLogEntries(watchId);
        return ResponseEntity.ok(entries);
    }

    /**
     * Create a log entry for a watch
     */
    @PostMapping("/{watchId}/log-entries")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createLogEntry(
            @PathVariable Long programId,
            @PathVariable Long watchId,
            @RequestBody WatchLogEntryRequest request,
            Authentication auth) {
        try {
            String staffEmail = auth.getName();
            WatchLogEntryResponse response = watchService.createLogEntry(watchId, request, staffEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

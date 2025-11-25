package app.ysp.controller;

import app.ysp.dto.ShiftLogRequest;
import app.ysp.dto.ShiftLogResponse;
import app.ysp.service.ShiftLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/programs/{programId}/logbook")
@PreAuthorize("isAuthenticated()")
public class LogbookController {
    
    @Autowired
    private ShiftLogService shiftLogService;
    
    /**
     * Get all shift logs for a program (paginated)
     * GET /programs/{programId}/logbook/shift-logs?page=0&size=10
     */
    @GetMapping("/shift-logs")
    public ResponseEntity<Page<ShiftLogResponse>> getShiftLogs(
        @PathVariable Long programId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<ShiftLogResponse> logs = shiftLogService.getShiftLogs(programId, page, size);
        return ResponseEntity.ok(logs);
    }
    
    /**
     * Get a specific shift log
     * GET /programs/{programId}/logbook/shift-logs/{id}
     */
    @GetMapping("/shift-logs/{id}")
    public ResponseEntity<ShiftLogResponse> getShiftLog(
        @PathVariable Long programId,
        @PathVariable Long id
    ) {
        ShiftLogResponse log = shiftLogService.getShiftLog(programId, id);
        return ResponseEntity.ok(log);
    }
    
    /**
     * Create a new shift log
     * POST /programs/{programId}/logbook/shift-logs
     */
    @PostMapping("/shift-logs")
    public ResponseEntity<ShiftLogResponse> createShiftLog(
        @PathVariable Long programId,
        @RequestBody ShiftLogRequest request
    ) {
        ShiftLogResponse created = shiftLogService.createShiftLog(programId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    /**
     * Update an existing shift log
     * PUT /programs/{programId}/logbook/shift-logs/{id}
     */
    @PutMapping("/shift-logs/{id}")
    public ResponseEntity<ShiftLogResponse> updateShiftLog(
        @PathVariable Long programId,
        @PathVariable Long id,
        @RequestBody ShiftLogRequest request
    ) {
        ShiftLogResponse updated = shiftLogService.updateShiftLog(programId, id, request);
        return ResponseEntity.ok(updated);
    }
    
    /**
     * Delete a shift log
     * DELETE /programs/{programId}/logbook/shift-logs/{id}
     */
    @DeleteMapping("/shift-logs/{id}")
    public ResponseEntity<Void> deleteShiftLog(
        @PathVariable Long programId,
        @PathVariable Long id
    ) {
        shiftLogService.deleteShiftLog(programId, id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Search shift logs with filters
     * GET /programs/{programId}/logbook/shift-logs/search?q=...&shiftType=...&status=...&startDate=...&endDate=...
     */
    @GetMapping("/shift-logs/search")
    public ResponseEntity<List<ShiftLogResponse>> searchShiftLogs(
        @PathVariable Long programId,
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String shiftType,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) LocalDate startDate,
        @RequestParam(required = false) LocalDate endDate
    ) {
        List<ShiftLogResponse> logs = shiftLogService.searchShiftLogs(programId, q, shiftType, status, startDate, endDate);
        return ResponseEntity.ok(logs);
    }
}

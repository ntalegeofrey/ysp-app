package app.ysp.controller;

import app.ysp.dto.IncidentReportRequest;
import app.ysp.dto.IncidentReportResponse;
import app.ysp.dto.ShakedownReportRequest;
import app.ysp.dto.ShakedownReportResponse;
import app.ysp.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programs/{programId}/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    // ============ INCIDENT REPORTS ============

    @GetMapping("/incident-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<IncidentReportResponse>> getIncidentReports(@PathVariable Long programId) {
        List<IncidentReportResponse> reports = incidentService.getAllIncidentReports(programId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/incident-reports/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<IncidentReportResponse> getIncidentReport(
            @PathVariable Long programId,
            @PathVariable Long id) {
        return incidentService.getIncidentReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/incident-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> createIncidentReport(
            @PathVariable Long programId,
            @RequestBody IncidentReportRequest request) {
        try {
            IncidentReportResponse response = incidentService.createIncidentReport(programId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ============ SHAKEDOWN REPORTS ============

    @GetMapping("/shakedown-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<ShakedownReportResponse>> getShakedownReports(@PathVariable Long programId) {
        List<ShakedownReportResponse> reports = incidentService.getAllShakedownReports(programId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/shakedown-reports/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ShakedownReportResponse> getShakedownReport(
            @PathVariable Long programId,
            @PathVariable Long id) {
        return incidentService.getShakedownReportById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/shakedown-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> createShakedownReport(
            @PathVariable Long programId,
            @RequestBody ShakedownReportRequest request) {
        try {
            ShakedownReportResponse response = incidentService.createShakedownReport(programId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

package app.ysp.controller;

import app.ysp.dto.*;
import app.ysp.service.MedicationService;
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
@RequestMapping("/programs/{programId}/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    // ============ RESIDENT MEDICATIONS ============

    /**
     * Add a new medication for a resident
     * POST /programs/{programId}/medications
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addResidentMedication(
            @PathVariable Long programId,
            @RequestBody ResidentMedicationRequest request,
            Authentication auth) {
        try {
            Long staffId = getUserIdFromAuth(auth);
            ResidentMedicationResponse response = medicationService.addResidentMedication(programId, request, staffId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error adding medication: " + e.getMessage()));
        }
    }

    /**
     * Get all active medications for a program
     * GET /programs/{programId}/medications
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ResidentMedicationResponse>> getProgramMedications(@PathVariable Long programId) {
        List<ResidentMedicationResponse> medications = medicationService.getProgramMedications(programId);
        return ResponseEntity.ok(medications);
    }

    /**
     * Get all medications for a specific resident
     * GET /programs/{programId}/medications/resident/{residentId}
     */
    @GetMapping("/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ResidentMedicationResponse>> getResidentMedications(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<ResidentMedicationResponse> medications = medicationService.getResidentMedications(residentId);
        return ResponseEntity.ok(medications);
    }

    /**
     * Update medication details
     * PUT /programs/{programId}/medications/{medicationId}
     */
    @PutMapping("/{medicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateMedication(
            @PathVariable Long programId,
            @PathVariable Long medicationId,
            @RequestBody Map<String, Object> body) {
        try {
            medicationService.updateMedication(medicationId, body);
            return ResponseEntity.ok(Map.of("message", "Medication updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating medication: " + e.getMessage()));
        }
    }

    /**
     * Delete a medication
     * DELETE /programs/{programId}/medications/{medicationId}
     */
    @DeleteMapping("/{medicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteMedication(
            @PathVariable Long programId,
            @PathVariable Long medicationId) {
        try {
            medicationService.deleteMedication(medicationId);
            return ResponseEntity.ok(Map.of("message", "Medication deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting medication: " + e.getMessage()));
        }
    }

    /**
     * Update medication count
     * PATCH /programs/{programId}/medications/{medicationId}/count
     */
    @PatchMapping("/{medicationId}/count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateMedicationCount(
            @PathVariable Long programId,
            @PathVariable Long medicationId,
            @RequestBody Map<String, Integer> body) {
        try {
            Integer newCount = body.get("count");
            if (newCount == null || newCount < 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid count value"));
            }
            medicationService.updateMedicationCount(medicationId, newCount);
            return ResponseEntity.ok(Map.of("message", "Count updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating count: " + e.getMessage()));
        }
    }

    /**
     * Discontinue a medication
     * PATCH /programs/{programId}/medications/{medicationId}/discontinue
     */
    @PatchMapping("/{medicationId}/discontinue")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> discontinueMedication(
            @PathVariable Long programId,
            @PathVariable Long medicationId) {
        try {
            medicationService.discontinueMedication(medicationId);
            return ResponseEntity.ok(Map.of("message", "Medication discontinued successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error discontinuing medication: " + e.getMessage()));
        }
    }

    /**
     * Administer a medication (alternative endpoint)
     * POST /programs/{programId}/medications/{medicationId}/administer
     */
    @PostMapping("/{medicationId}/administer")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> administerMedication(
            @PathVariable Long programId,
            @PathVariable Long medicationId,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        try {
            Long staffId = getUserIdFromAuth(auth);
            
            // Map frontend fields to backend DTO
            MedicationAdministrationRequest request = new MedicationAdministrationRequest();
            request.setResidentId(body.get("residentId") != null ? 
                    Long.valueOf(body.get("residentId").toString()) : null);
            request.setResidentMedicationId(medicationId);
            
            // Map status to action (given -> ADMINISTERED, denied -> REFUSED, other -> HELD)
            String status = (String) body.get("status");
            String action = "ADMINISTERED";
            if ("denied".equals(status)) {
                action = "REFUSED";
            } else if ("other".equals(status)) {
                action = "HELD";
            }
            request.setAction(action);
            
            // Set current date/time if not provided
            request.setAdministrationDate(java.time.LocalDate.now());
            java.time.LocalTime now = java.time.LocalTime.now();
            request.setAdministrationTime(now);
            
            // Determine shift based on time
            int hour = now.getHour();
            String shift;
            if (hour >= 7 && hour < 15) {
                shift = "MORNING";  // 7 AM - 3 PM (First shift)
            } else if (hour >= 15 && hour < 23) {
                shift = "EVENING";  // 3 PM - 11 PM (Second shift)
            } else {
                shift = "NIGHT";    // 11 PM - 7 AM (Third shift)
            }
            request.setShift(shift);
            
            // Add notes if provided
            if (body.containsKey("notes")) {
                request.setNotes((String) body.get("notes"));
            }
            
            MedicationAdministrationResponse response = medicationService.logAdministration(programId, request, staffId);
            
            // Update medication count if given
            if ("given".equals(status) && body.containsKey("quantity")) {
                Integer quantity = Integer.valueOf(body.get("quantity").toString());
                medicationService.decrementMedicationCount(medicationId, quantity);
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error administering medication: " + e.getMessage()));
        }
    }

    // ============ MEDICATION ADMINISTRATION ============

    /**
     * Log a medication administration
     * POST /programs/{programId}/medications/administrations
     */
    @PostMapping("/administrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logAdministration(
            @PathVariable Long programId,
            @RequestBody MedicationAdministrationRequest request,
            Authentication auth) {
        try {
            Long staffId = getUserIdFromAuth(auth);
            MedicationAdministrationResponse response = medicationService.logAdministration(programId, request, staffId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error logging administration: " + e.getMessage()));
        }
    }

    /**
     * Get medication administrations with filters
     * GET /programs/{programId}/medications/administrations
     */
    @GetMapping("/administrations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAdministrations(
            @PathVariable Long programId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        // Default to last 30 days if no dates provided
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        Map<String, Object> response = medicationService.getAdministrations(programId, startDate, endDate, page, size);
        return ResponseEntity.ok(response);
    }

    /**
     * Get medication administrations for a specific resident
     * GET /programs/{programId}/medications/administrations/resident/{residentId}
     */
    @GetMapping("/administrations/resident/{residentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MedicationAdministrationResponse>> getResidentAdministrations(
            @PathVariable Long programId,
            @PathVariable Long residentId) {
        List<MedicationAdministrationResponse> administrations = medicationService.getResidentAdministrations(residentId);
        return ResponseEntity.ok(administrations);
    }

    // ============ MEDICATION AUDITS ============

    /**
     * Submit a medication audit
     * POST /programs/{programId}/medications/audits
     */
    @PostMapping("/audits")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitAudit(
            @PathVariable Long programId,
            @RequestBody MedicationAuditRequest request,
            Authentication auth) {
        try {
            Long staffId = getUserIdFromAuth(auth);
            MedicationAuditResponse response = medicationService.submitAudit(programId, request, staffId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error submitting audit: " + e.getMessage()));
        }
    }

    /**
     * Get pending audits for approval
     * GET /programs/{programId}/medications/audits/pending
     */
    @GetMapping("/audits/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MedicationAuditResponse>> getPendingAudits(@PathVariable Long programId) {
        List<MedicationAuditResponse> audits = medicationService.getPendingAudits(programId);
        return ResponseEntity.ok(audits);
    }

    /**
     * Approve or deny an audit
     * PATCH /programs/{programId}/medications/audits/{auditId}/approval
     */
    @PatchMapping("/audits/{auditId}/approval")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> approveAudit(
            @PathVariable Long programId,
            @PathVariable Long auditId,
            @RequestBody MedicationAuditApprovalRequest request,
            Authentication auth) {
        try {
            Long staffId = getUserIdFromAuth(auth);
            
            // Validate status
            if (!"APPROVED".equals(request.getStatus()) && !"DENIED".equals(request.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status must be APPROVED or DENIED"));
            }
            
            MedicationAuditResponse response = medicationService.approveAudit(auditId, request, staffId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error processing audit approval: " + e.getMessage()));
        }
    }

    /**
     * Get audits with filters and pagination
     * GET /programs/{programId}/medications/audits
     */
    @GetMapping("/audits")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAudits(
            @PathVariable Long programId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String shift,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean hasDiscrepancies,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Map<String, Object> response = medicationService.getAudits(
                programId, status, shift, startDate, endDate, hasDiscrepancies, page, size);
        return ResponseEntity.ok(response);
    }

    // ============ MEDICATION ALERTS ============

    /**
     * Get active alerts for a program
     * GET /programs/{programId}/medications/alerts
     */
    @GetMapping("/alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MedicationAlertResponse>> getActiveAlerts(@PathVariable Long programId) {
        List<MedicationAlertResponse> alerts = medicationService.getActiveAlerts(programId);
        return ResponseEntity.ok(alerts);
    }

    /**
     * Resolve an alert
     * PATCH /programs/{programId}/medications/alerts/{alertId}/resolve
     */
    @PatchMapping("/alerts/{alertId}/resolve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> resolveAlert(
            @PathVariable Long programId,
            @PathVariable Long alertId,
            Authentication auth) {
        try {
            Long staffId = getUserIdFromAuth(auth);
            medicationService.resolveAlert(alertId, staffId);
            return ResponseEntity.ok(Map.of("message", "Alert resolved successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error resolving alert: " + e.getMessage()));
        }
    }

    /**
     * Create a new alert manually
     * POST /programs/{programId}/medications/alerts
     */
    @PostMapping("/alerts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createAlert(
            @PathVariable Long programId,
            @RequestBody Map<String, Object> request) {
        try {
            Long residentId = request.get("residentId") != null ? 
                    Long.valueOf(request.get("residentId").toString()) : null;
            Long medicationId = request.get("medicationId") != null ? 
                    Long.valueOf(request.get("medicationId").toString()) : null;
            String alertType = (String) request.get("alertType");
            String title = (String) request.get("title");
            String description = (String) request.get("description");
            
            if (alertType == null || title == null || description == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }
            
            medicationService.createAlert(programId, residentId, medicationId, alertType, title, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Alert created successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating alert: " + e.getMessage()));
        }
    }

    // ============ HELPER METHODS ============

    /**
     * Extract user ID from authentication
     */
    private Long getUserIdFromAuth(Authentication auth) {
        String email = auth.getName();
        return medicationService.getUserIdByEmail(email);
    }
}

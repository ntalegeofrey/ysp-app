package app.ysp.controller;

import app.ysp.entity.Program;
import app.ysp.entity.ProgramUcrReport;
import app.ysp.entity.ProgramAssignment;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramUcrReportRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.service.SseHub;
import app.ysp.service.MailService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/programs/{id}/ucr")
public class ProgramUcrController {

    private final ProgramRepository programs;
    private final ProgramUcrReportRepository ucrs;
    private final SseHub sseHub;
    private final UserRepository users;
    private final ProgramAssignmentRepository assignments;
    private final MailService mailService;

    public ProgramUcrController(ProgramRepository programs, ProgramUcrReportRepository ucrs, SseHub sseHub, UserRepository users, ProgramAssignmentRepository assignments, MailService mailService) {
        this.programs = programs;
        this.ucrs = ucrs;
        this.sseHub = sseHub;
        this.users = users;
        this.assignments = assignments;
        this.mailService = mailService;
    }

    @GetMapping("/reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> list(@PathVariable("id") Long programId, Authentication auth) {
        // Any authenticated user attached to the program should be able to view; attachment gate is in layout already.
        if (programId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(ucrs.findAllByProgramOrder(programId));
    }

    @GetMapping("/reports/page")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> listPaged(
            @PathVariable("id") Long programId,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "date", required = false) String dateStr,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "5") int size
    ) {
        if (programId == null) return ResponseEntity.badRequest().build();
        LocalDate date = null;
        if (dateStr != null && !dateStr.isBlank()) {
            try { date = LocalDate.parse(dateStr); } catch (Exception ignored) {}
        }
        var pageable = PageRequest.of(Math.max(page,0), Math.max(size,1));
        var p = ucrs.findByFilters(programId, (q==null||q.isBlank())? null : q, date, pageable);
        
        // Apply status filter in Java if provided
        java.util.List<ProgramUcrReport> filtered = p.getContent();
        if (status != null && !status.isBlank() && !"All Status".equals(status)) {
            filtered = filtered.stream()
                .filter(r -> hasStatusMatch(r, status))
                .collect(java.util.stream.Collectors.toList());
        }
        
        Map<String,Object> out = new HashMap<>();
        out.put("content", filtered);
        out.put("totalElements", p.getTotalElements());
        out.put("page", p.getNumber());
        out.put("size", p.getSize());
        return ResponseEntity.ok(out);
    }
    
    private boolean hasStatusMatch(ProgramUcrReport r, String status) {
        String s = status.toLowerCase();
        if ("normal".equals(s)) {
            // Check if report has no Critical/High/Medium issues
            return !hasAnyIssues(r);
        }
        // Check if any field has the specified status
        return checkFieldForStatus(r.getSecurityRadiosCondition(), s) ||
               checkFieldForStatus(r.getSecurityFlashlightsCondition(), s) ||
               checkFieldForStatus(r.getSecurityMetalDetectorCondition(), s) ||
               checkFieldForStatus(r.getSecurityBigSetKeysCondition(), s) ||
               checkFieldForStatus(r.getSecurityFirstAidKitsCondition(), s) ||
               checkFieldForStatus(r.getSecurityDeskComputerCondition(), s) ||
               checkFieldForStatus(r.getAdminMeetingRoomsLockedCondition(), s) ||
               checkFieldForStatus(r.getAdminDoorsSecureCondition(), s) ||
               checkFieldForStatus(r.getInfraBackDoorCondition(), s) ||
               checkFieldForStatus(r.getInfraEntranceExitDoorsCondition(), s) ||
               checkFieldForStatus(r.getInfraSmokeDetectorsCondition(), s) ||
               checkFieldForStatus(r.getInfraWindowsSecureCondition(), s) ||
               checkFieldForStatus(r.getInfraLaundryAreaCondition(), s) ||
               checkFieldForStatus(r.getInfraFireExtinguishersCondition(), s) ||
               checkFieldForStatus(r.getInfraFireAlarmCondition(), s);
    }
    
    private boolean checkFieldForStatus(String field, String status) {
        return field != null && field.toLowerCase().contains(status);
    }
    
    private boolean hasAnyIssues(ProgramUcrReport r) {
        return checkFieldForStatus(r.getSecurityRadiosCondition(), "critical") ||
               checkFieldForStatus(r.getSecurityRadiosCondition(), "high") ||
               checkFieldForStatus(r.getSecurityRadiosCondition(), "medium") ||
               checkFieldForStatus(r.getSecurityFlashlightsCondition(), "critical") ||
               checkFieldForStatus(r.getSecurityFlashlightsCondition(), "high") ||
               checkFieldForStatus(r.getSecurityFlashlightsCondition(), "medium") ||
               checkFieldForStatus(r.getSecurityMetalDetectorCondition(), "critical") ||
               checkFieldForStatus(r.getSecurityMetalDetectorCondition(), "high") ||
               checkFieldForStatus(r.getSecurityMetalDetectorCondition(), "medium") ||
               checkFieldForStatus(r.getSecurityBigSetKeysCondition(), "critical") ||
               checkFieldForStatus(r.getSecurityBigSetKeysCondition(), "high") ||
               checkFieldForStatus(r.getSecurityBigSetKeysCondition(), "medium") ||
               checkFieldForStatus(r.getSecurityFirstAidKitsCondition(), "critical") ||
               checkFieldForStatus(r.getSecurityFirstAidKitsCondition(), "high") ||
               checkFieldForStatus(r.getSecurityFirstAidKitsCondition(), "medium") ||
               checkFieldForStatus(r.getSecurityDeskComputerCondition(), "critical") ||
               checkFieldForStatus(r.getSecurityDeskComputerCondition(), "high") ||
               checkFieldForStatus(r.getSecurityDeskComputerCondition(), "medium") ||
               checkFieldForStatus(r.getAdminMeetingRoomsLockedCondition(), "critical") ||
               checkFieldForStatus(r.getAdminMeetingRoomsLockedCondition(), "high") ||
               checkFieldForStatus(r.getAdminMeetingRoomsLockedCondition(), "medium") ||
               checkFieldForStatus(r.getAdminDoorsSecureCondition(), "critical") ||
               checkFieldForStatus(r.getAdminDoorsSecureCondition(), "high") ||
               checkFieldForStatus(r.getAdminDoorsSecureCondition(), "medium") ||
               checkFieldForStatus(r.getInfraBackDoorCondition(), "critical") ||
               checkFieldForStatus(r.getInfraBackDoorCondition(), "high") ||
               checkFieldForStatus(r.getInfraBackDoorCondition(), "medium") ||
               checkFieldForStatus(r.getInfraEntranceExitDoorsCondition(), "critical") ||
               checkFieldForStatus(r.getInfraEntranceExitDoorsCondition(), "high") ||
               checkFieldForStatus(r.getInfraEntranceExitDoorsCondition(), "medium") ||
               checkFieldForStatus(r.getInfraSmokeDetectorsCondition(), "critical") ||
               checkFieldForStatus(r.getInfraSmokeDetectorsCondition(), "high") ||
               checkFieldForStatus(r.getInfraSmokeDetectorsCondition(), "medium") ||
               checkFieldForStatus(r.getInfraWindowsSecureCondition(), "critical") ||
               checkFieldForStatus(r.getInfraWindowsSecureCondition(), "high") ||
               checkFieldForStatus(r.getInfraWindowsSecureCondition(), "medium") ||
               checkFieldForStatus(r.getInfraLaundryAreaCondition(), "critical") ||
               checkFieldForStatus(r.getInfraLaundryAreaCondition(), "high") ||
               checkFieldForStatus(r.getInfraLaundryAreaCondition(), "medium") ||
               checkFieldForStatus(r.getInfraFireExtinguishersCondition(), "critical") ||
               checkFieldForStatus(r.getInfraFireExtinguishersCondition(), "high") ||
               checkFieldForStatus(r.getInfraFireExtinguishersCondition(), "medium") ||
               checkFieldForStatus(r.getInfraFireAlarmCondition(), "critical") ||
               checkFieldForStatus(r.getInfraFireAlarmCondition(), "high") ||
               checkFieldForStatus(r.getInfraFireAlarmCondition(), "medium");
    }

    @GetMapping("/reports/{reportId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getOne(@PathVariable("id") Long id, @PathVariable("reportId") Long reportId) {
        var r = ucrs.findOneByIdAndProgram(reportId, id);
        if (r == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(r);
    }

    // Helper method to map body fields to entity
    private void mapFieldsToReport(ProgramUcrReport r, Map<String, Object> body) {
        // Security Equipment
        r.setSecurityRadiosStatus(getString(body, "securityRadiosStatus"));
        r.setSecurityRadiosCondition(getString(body, "securityRadiosCondition"));
        r.setSecurityRadiosComments(getString(body, "securityRadiosComments"));
        r.setSecurityFlashlightsStatus(getString(body, "securityFlashlightsStatus"));
        r.setSecurityFlashlightsCondition(getString(body, "securityFlashlightsCondition"));
        r.setSecurityFlashlightsComments(getString(body, "securityFlashlightsComments"));
        r.setSecurityMetalDetectorStatus(getString(body, "securityMetalDetectorStatus"));
        r.setSecurityMetalDetectorCondition(getString(body, "securityMetalDetectorCondition"));
        r.setSecurityMetalDetectorComments(getString(body, "securityMetalDetectorComments"));
        r.setSecurityBigSetKeysStatus(getString(body, "securityBigSetKeysStatus"));
        r.setSecurityBigSetKeysCondition(getString(body, "securityBigSetKeysCondition"));
        r.setSecurityBigSetKeysComments(getString(body, "securityBigSetKeysComments"));
        r.setSecurityFirstAidKitsStatus(getString(body, "securityFirstAidKitsStatus"));
        r.setSecurityFirstAidKitsCondition(getString(body, "securityFirstAidKitsCondition"));
        r.setSecurityFirstAidKitsComments(getString(body, "securityFirstAidKitsComments"));
        r.setSecurityDeskComputerStatus(getString(body, "securityDeskComputerStatus"));
        r.setSecurityDeskComputerCondition(getString(body, "securityDeskComputerCondition"));
        r.setSecurityDeskComputerComments(getString(body, "securityDeskComputerComments"));
        
        // Hardware/Searches
        r.setHardwareSecureYesNo(getString(body, "hardwareSecureYesNo"));
        r.setHardwareSecureComments(getString(body, "hardwareSecureComments"));
        r.setSearchesCompletedYesNo(getString(body, "searchesCompletedYesNo"));
        r.setFireDrillsCompletedYesNo(getString(body, "fireDrillsCompletedYesNo"));
        r.setFireDrillsCompletedComments(getString(body, "fireDrillsCompletedComments"));
        r.setEmergencyLightingYesNo(getString(body, "emergencyLightingYesNo"));
        r.setEmergencyLightingComments(getString(body, "emergencyLightingComments"));
        
        // Notifications
        r.setNotificationsOppositeGenderYesNo(getString(body, "notificationsOppositeGenderYesNo"));
        r.setNotificationsOppositeGenderCondition(getString(body, "notificationsOppositeGenderCondition"));
        r.setNotificationsOppositeGenderComments(getString(body, "notificationsOppositeGenderComments"));
        
        // Admin Offices
        r.setAdminMeetingRoomsLockedStatus(getString(body, "adminMeetingRoomsLockedStatus"));
        r.setAdminMeetingRoomsLockedCondition(getString(body, "adminMeetingRoomsLockedCondition"));
        r.setAdminMeetingRoomsLockedComments(getString(body, "adminMeetingRoomsLockedComments"));
        r.setAdminDoorsSecureStatus(getString(body, "adminDoorsSecureStatus"));
        r.setAdminDoorsSecureCondition(getString(body, "adminDoorsSecureCondition"));
        r.setAdminDoorsSecureComments(getString(body, "adminDoorsSecureComments"));
        
        // Infrastructure
        r.setInfraBackDoorStatus(getString(body, "infraBackDoorStatus"));
        r.setInfraBackDoorCondition(getString(body, "infraBackDoorCondition"));
        r.setInfraBackDoorComments(getString(body, "infraBackDoorComments"));
        r.setInfraEntranceExitDoorsStatus(getString(body, "infraEntranceExitDoorsStatus"));
        r.setInfraEntranceExitDoorsCondition(getString(body, "infraEntranceExitDoorsCondition"));
        r.setInfraEntranceExitDoorsComments(getString(body, "infraEntranceExitDoorsComments"));
        r.setInfraSmokeDetectorsStatus(getString(body, "infraSmokeDetectorsStatus"));
        r.setInfraSmokeDetectorsCondition(getString(body, "infraSmokeDetectorsCondition"));
        r.setInfraSmokeDetectorsComments(getString(body, "infraSmokeDetectorsComments"));
        r.setInfraWindowsSecureStatus(getString(body, "infraWindowsSecureStatus"));
        r.setInfraWindowsSecureCondition(getString(body, "infraWindowsSecureCondition"));
        r.setInfraWindowsSecureComments(getString(body, "infraWindowsSecureComments"));
        r.setInfraLaundryAreaStatus(getString(body, "infraLaundryAreaStatus"));
        r.setInfraLaundryAreaCondition(getString(body, "infraLaundryAreaCondition"));
        r.setInfraLaundryAreaComments(getString(body, "infraLaundryAreaComments"));
        r.setInfraFireExtinguishersStatus(getString(body, "infraFireExtinguishersStatus"));
        r.setInfraFireExtinguishersCondition(getString(body, "infraFireExtinguishersCondition"));
        r.setInfraFireExtinguishersComments(getString(body, "infraFireExtinguishersComments"));
        r.setInfraFireAlarmStatus(getString(body, "infraFireAlarmStatus"));
        r.setInfraFireAlarmCondition(getString(body, "infraFireAlarmCondition"));
        r.setInfraFireAlarmComments(getString(body, "infraFireAlarmComments"));
        
        // Chore Workspace
        r.setChoreWorkspaceCleanStatus(getString(body, "choreWorkspaceCleanStatus"));
        r.setChoreWorkspaceCleanComments(getString(body, "choreWorkspaceCleanComments"));
        r.setChoreStaffBathroomStatus(getString(body, "choreStaffBathroomStatus"));
        r.setChoreStaffBathroomComments(getString(body, "choreStaffBathroomComments"));
        r.setChoreDayroomCleanStatus(getString(body, "choreDayroomCleanStatus"));
        r.setChoreDayroomCleanComments(getString(body, "choreDayroomCleanComments"));
        r.setChoreLaundryRoomCleanStatus(getString(body, "choreLaundryRoomCleanStatus"));
        r.setChoreLaundryRoomCleanComments(getString(body, "choreLaundryRoomCleanComments"));
        
        // Room searches and comments
        if (body.containsKey("roomSearches")) {
            try {
                r.setRoomSearches(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(body.get("roomSearches")));
            } catch (Exception ignored) {}
        }
        r.setAdditionalComments(getString(body, "additionalComments"));
    }
    
    private String getString(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? val.toString() : null;
    }

    @PostMapping("/reports")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> create(@PathVariable("id") Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        Optional<Program> opt = programs.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Program program = opt.get();

        ProgramUcrReport r = new ProgramUcrReport();
        r.setProgram(program);
        
        // Set reporter from body if provided (frontend handles this)
        Object staffIdObj = body.get("staffId");
        if (staffIdObj != null) {
            try {
                r.setStaffId(Long.parseLong(staffIdObj.toString()));
            } catch (NumberFormatException ignored) {}
        }
        r.setStaffName(getString(body, "staffName"));
        
        LocalDate date;
        try {
            Object d = body.get("reportDate");
            date = d != null ? LocalDate.parse(d.toString()) : LocalDate.now();
        } catch (Exception e) {
            date = LocalDate.now();
        }
        r.setReportDate(date);
        String shiftTime = getString(body, "shiftTime");
        r.setShiftTime(shiftTime);

        // Enforce one UCR per program/date/shift
        if (shiftTime != null && !shiftTime.isBlank()) {
            ProgramUcrReport existing = ucrs.findFirstByProgram_IdAndReportDateAndShiftTime(id, date, shiftTime);
            if (existing != null) {
                Map<String, Object> err = new HashMap<>();
                err.put("message", "UCR report already exists for this date and shift. Please edit the existing report.");
                err.put("existingId", existing.getId());
                return ResponseEntity.status(409).body(err);
            }
        }

        // Map all fields from body to report
        mapFieldsToReport(r, body);

        ProgramUcrReport saved = ucrs.save(r);
        try { sseHub.broadcast(Map.of("type","programs.ucr.created","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/reports/{reportId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @PathVariable("reportId") Long reportId, @RequestBody Map<String, Object> body) {
        Optional<ProgramUcrReport> opt = ucrs.findById(reportId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        ProgramUcrReport r = opt.get();
        if (r.getProgram() == null || r.getProgram().getId() == null || !Objects.equals(r.getProgram().getId(), id)) {
            return ResponseEntity.notFound().build();
        }

        // Allow edits only on the same calendar day as the report date
        LocalDate today = LocalDate.now();
        if (r.getReportDate() != null && !r.getReportDate().isEqual(today)) {
            Map<String, Object> err = new HashMap<>();
            err.put("message", "UCR reports can only be edited on the day they are created.");
            return ResponseEntity.status(423).body(err);
        }
        if (body.containsKey("reportDate")) {
            try { r.setReportDate(LocalDate.parse(Objects.toString(body.get("reportDate"), null))); } catch (Exception ignored) {}
        }
        if (body.containsKey("shiftTime")) r.setShiftTime(getString(body, "shiftTime"));
        if (body.containsKey("staffName")) r.setStaffName(getString(body, "staffName"));

        // Map all fields from body to report
        mapFieldsToReport(r, body);

        ProgramUcrReport saved = ucrs.save(r);
        try { sseHub.broadcast(Map.of("type","programs.ucr.updated","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/stats")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> stats(@PathVariable("id") Long programId) {
        YearMonth now = YearMonth.now();
        LocalDate start = now.atDay(1);
        LocalDate end = now.atEndOfMonth();
        Map<String, Object> out = new HashMap<>();
        out.put("total", ucrs.countByProgramId(programId));
        out.put("critical", ucrs.countAllIssues(programId)); // Count ALL unresolved issues (Critical + High + Medium)
        out.put("high", ucrs.countHigh(programId));
        out.put("monthCount", ucrs.countInRange(programId, start, end));
        return ResponseEntity.ok(out);
    }

    @GetMapping("/open-issues")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> openIssues(
            @PathVariable("id") Long programId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        var p = ucrs.findOpenIssues(programId, PageRequest.of(Math.max(0,page), Math.max(1,size)));
        Map<String,Object> out = new HashMap<>();
        out.put("content", p.getContent());
        out.put("totalElements", p.getTotalElements());
        return ResponseEntity.ok(out);
    }

    @PostMapping("/reports/{reportId}/resolve")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> resolveReport(
            @PathVariable("id") Long programId,
            @PathVariable("reportId") Long reportId,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        var report = ucrs.findOneByIdAndProgram(reportId, programId);
        if (report == null) return ResponseEntity.notFound().build();
        
        // Get the specific issue field being resolved
        String issueField = body != null ? getString(body, "issueField") : null;
        
        if (issueField != null && !issueField.isBlank()) {
            // Resolve specific issue
            String current = report.getResolvedIssues();
            java.util.Set<String> resolved = new java.util.HashSet<>();
            if (current != null && !current.isBlank()) {
                resolved.addAll(java.util.Arrays.asList(current.split(",")));
            }
            resolved.add(issueField);
            report.setResolvedIssues(String.join(",", resolved));
            
            // Check if all issues are now resolved
            boolean allResolved = checkAllIssuesResolved(report, resolved);
            if (allResolved) {
                report.setResolved(true);
                report.setResolvedAt(java.time.LocalDateTime.now());
            }
        } else {
            // Resolve entire report
            report.setResolved(true);
            report.setResolvedAt(java.time.LocalDateTime.now());
        }
        
        ucrs.save(report);
        return ResponseEntity.ok(report);
    }
    
    private boolean checkAllIssuesResolved(ProgramUcrReport r, java.util.Set<String> resolved) {
        // Check if all Critical/High/Medium issues are resolved
        String[] fields = {
            "securityRadios", "securityFlashlights", "securityMetalDetector",
            "securityBigSetKeys", "securityFirstAidKits", "securityDeskComputer",
            "adminMeetingRoomsLocked", "adminDoorsSecure",
            "infraBackDoor", "infraEntranceExitDoors", "infraSmokeDetectors",
            "infraWindowsSecure", "infraLaundryArea", "infraFireExtinguishers", "infraFireAlarm"
        };
        
        for (String field : fields) {
            String condition = getConditionValue(r, field);
            if (condition != null && (condition.toLowerCase().contains("critical") || 
                condition.toLowerCase().contains("high") || 
                condition.toLowerCase().contains("medium"))) {
                if (!resolved.contains(field)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    private String getConditionValue(ProgramUcrReport r, String field) {
        try {
            String methodName = "get" + field.substring(0,1).toUpperCase() + field.substring(1) + "Condition";
            var method = ProgramUcrReport.class.getMethod(methodName);
            return (String) method.invoke(r);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/monthly-chart")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> monthlyChart(@PathVariable("id") Long programId, @RequestParam(value = "year", defaultValue = "0") int year) {
        if (year <= 0) year = java.time.Year.now().getValue();
        List<Object[]> rawData = ucrs.findMonthlyIssueCounts(programId, year);
        
        // Initialize arrays for 12 months
        int[] critical = new int[12];
        int[] high = new int[12];
        int[] medium = new int[12];
        int[] resolved = new int[12];
        
        // Process raw data: [month, status, count]
        for (Object[] row : rawData) {
            int month = ((Number) row[0]).intValue(); // 1-12
            String status = (String) row[1]; // 'critical', 'high', 'medium'
            int count = ((Number) row[2]).intValue();
            
            int idx = month - 1; // Convert to 0-11 for array index
            if (idx < 0 || idx > 11) continue;
            
            if ("critical".equalsIgnoreCase(status)) {
                critical[idx] = count;
            } else if ("high".equalsIgnoreCase(status)) {
                high[idx] = count;
            } else if ("medium".equalsIgnoreCase(status)) {
                medium[idx] = count;
            }
        }
        
        // Get resolved counts by month
        List<Object[]> resolvedData = ucrs.findResolvedCountsByMonth(programId, year);
        for (Object[] row : resolvedData) {
            int month = ((Number) row[0]).intValue();
            int count = ((Number) row[1]).intValue();
            int idx = month - 1;
            if (idx >= 0 && idx < 12) {
                resolved[idx] = count;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("critical", critical);
        result.put("high", high);
        result.put("medium", medium);
        result.put("resolved", resolved);
        result.put("year", year);
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/notify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> notifySupervisors(@PathVariable("id") Long programId, @RequestBody Map<String, Object> body, Authentication auth) {
        Optional<Program> optProgram = programs.findById(programId);
        if (optProgram.isEmpty()) return ResponseEntity.notFound().build();
        Program program = optProgram.get();

        // Resolve sender info from authenticated user
        String senderName = "";
        String senderTitle = "";
        if (auth != null && auth.getName() != null) {
            var optUser = users.findByEmail(auth.getName());
            if (optUser.isPresent()) {
                var u = optUser.get();
                String fn = u.getFullName();
                senderName = (fn != null && !fn.isBlank()) ? fn : u.getEmail();
                senderTitle = Objects.toString(u.getJobTitle(), "");
            }
        }

        String subject = Objects.toString(body.get("subject"), "UCR Supervisor Notification");
        String priority = Objects.toString(body.get("priority"), "");
        String category = Objects.toString(body.get("category"), "");
        String categoryOther = Objects.toString(body.get("categoryOther"), "");
        String message = Objects.toString(body.get("message"), "");

        // Find PD and Assistant Director assignments for this program
        java.util.List<ProgramAssignment> ass = assignments.findByProgram_Id(programId);
        java.util.List<String> emails = new java.util.ArrayList<>();
        for (ProgramAssignment pa : ass) {
            if (pa.getUserEmail() == null || pa.getUserEmail().isBlank()) continue;
            String role = pa.getRoleType() != null ? pa.getRoleType().toUpperCase() : "";
            if ("PROGRAM_DIRECTOR".equals(role) || "ASSISTANT_DIRECTOR".equals(role)) {
                emails.add(pa.getUserEmail());
            }
        }
        if (emails.isEmpty()) {
            return ResponseEntity.status(400).body(java.util.Map.of("error", "No program director or assistant director email configured for this program."));
        }

        StringBuilder html = new StringBuilder();
        html.append("<div style='font-family:Arial,sans-serif;font-size:14px;'>");
        html.append("<h2>Unit Condition Report Notification</h2>");
        html.append("<p><strong>Program:</strong> ").append(escape(program.getName())).append("</p>");
        if (!priority.isBlank()) html.append("<p><strong>Priority:</strong> ").append(escape(priority)).append("</p>");
        if (!category.isBlank()) html.append("<p><strong>Category:</strong> ").append(escape(category)).append("</p>");
        if (!categoryOther.isBlank()) html.append("<p><strong>Other Details:</strong> ").append(escape(categoryOther)).append("</p>");
        if (!message.isBlank()) {
            html.append("<p><strong>Summary:</strong><br/>").append(escape(message).replace("\n", "<br/>")).append("</p>");
        }
        if (!senderName.isBlank() || !senderTitle.isBlank()) {
            html.append("<hr/><p><strong>Reported by:</strong> ");
            html.append(escape(senderName));
            if (!senderTitle.isBlank()) {
                html.append("<br/><span style='color:#555;'>").append(escape(senderTitle)).append("</span>");
            }
            html.append("</p>");
        }
        html.append("</div>");

        for (String to : emails) {
            try {
                mailService.sendRawHtml(to, subject, html.toString());
            } catch (Exception ignored) {}
        }

        return ResponseEntity.ok(java.util.Map.of("sent", emails.size()));
    }

    private static String escape(String in) {
        if (in == null) return "";
        return in
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}

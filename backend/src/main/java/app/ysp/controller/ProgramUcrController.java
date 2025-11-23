package app.ysp.controller;

import app.ysp.entity.Program;
import app.ysp.entity.ProgramUcrReport;
import app.ysp.entity.ProgramUcrNotification;
import app.ysp.entity.ProgramAssignment;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramUcrReportRepository;
import app.ysp.repo.ProgramUcrNotificationRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.service.SseHub;
import app.ysp.service.MailService;
import org.springframework.beans.factory.annotation.Value;
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
    private final ProgramUcrNotificationRepository notifications;
    private final SseHub sseHub;
    private final UserRepository users;
    private final ProgramAssignmentRepository assignments;
    private final MailService mailService;

    @Value("${app.brand.logoUrl:}")
    private String brandLogoUrl;

    public ProgramUcrController(ProgramRepository programs,
                               ProgramUcrReportRepository ucrs,
                               ProgramUcrNotificationRepository notifications,
                               SseHub sseHub,
                               UserRepository users,
                               ProgramAssignmentRepository assignments,
                               MailService mailService) {
        this.programs = programs;
        this.ucrs = ucrs;
        this.notifications = notifications;
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

        // Allow edits only for current and future dates (not past dates)
        LocalDate today = LocalDate.now();
        if (r.getReportDate() != null && r.getReportDate().isBefore(today)) {
            Map<String, Object> err = new HashMap<>();
            err.put("message", "UCR reports from past dates can no longer be edited.");
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
    public ResponseEntity<?> notifySupervisors(@PathVariable("id") Long programId,
                                               @RequestBody Map<String, Object> body,
                                               Authentication auth) {
        Optional<Program> optProgram = programs.findById(programId);
        if (optProgram.isEmpty()) return ResponseEntity.notFound().build();
        Program program = optProgram.get();

        // Resolve linked UCR report (if provided)
        Long reportId = null;
        if (body.get("reportId") != null) {
            try { reportId = Long.parseLong(Objects.toString(body.get("reportId"))); } catch (NumberFormatException ignored) {}
        }
        ProgramUcrReport report = null;
        if (reportId != null) {
            report = ucrs.findOneByIdAndProgram(reportId, programId);
        }

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

        // New structured fields from frontend
        String subjectLine = Objects.toString(body.get("subjectLine"), null);
        String priorityLevel = Objects.toString(body.get("priorityLevel"), "");
        String issueCategory = Objects.toString(body.get("issueCategory"), "");
        String issueTitle = Objects.toString(body.get("issueTitle"), "");
        String issueSummary = Objects.toString(body.get("issueSummary"), "");
        String additionalComments = Objects.toString(body.get("additionalComments"), "");

        // Backwards-compat: allow old fields if new ones are not provided
        String legacySubject = Objects.toString(body.get("subject"), "UCR Supervisor Notification");
        String legacyPriority = Objects.toString(body.get("priority"), "");
        String legacyCategory = Objects.toString(body.get("category"), "");
        String legacyCategoryOther = Objects.toString(body.get("categoryOther"), "");
        String legacyMessage = Objects.toString(body.get("message"), "");

        String finalSubject = subjectLine != null && !subjectLine.isBlank() ? subjectLine : legacySubject;

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

        // Build HTML body with simple DYS-themed card layout
        String effectivePriority = !priorityLevel.isBlank() ? priorityLevel : legacyPriority;
        String effectiveCategory = !issueCategory.isBlank() ? issueCategory : legacyCategory;

        String priorityBadgeColor = "#10b981"; // green default
        if (effectivePriority != null) {
            String p = effectivePriority.toLowerCase();
            if (p.contains("critical")) priorityBadgeColor = "#dc2626"; // red
            else if (p.contains("high")) priorityBadgeColor = "#f59e0b"; // amber
            else if (p.contains("medium")) priorityBadgeColor = "#3b82f6"; // blue
        }

        StringBuilder html = new StringBuilder();
        html.append("<div style='background:#f3f4f6;padding:24px;font-family:system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;color:#111827;'>");
        html.append("  <div style='max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 10px 25px rgba(15,23,42,0.12);'>");
        // Header with logo + title
        html.append("    <div style='display:flex;align-items:center;padding:16px 20px;border-bottom:1px solid #e5e7eb;background:linear-gradient(to right,#0f172a,#1d4ed8);color:#e5e7eb;'>");
        if (brandLogoUrl != null && !brandLogoUrl.isBlank()) {
            html.append("      <div style='width:40px;height:40px;border-radius:9999px;background:#0f172a;display:flex;align-items:center;justify-content:center;margin-right:12px;overflow:hidden;'>");
            html.append("        <img src='")
                .append(brandLogoUrl)
                .append("' alt='DYS Logo' style='width:100%;height:100%;object-fit:contain;border-radius:9999px;' />");
            html.append("      </div>");
        }
        html.append("      <div style='flex:1;'>");
        html.append("        <div style='font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#9ca3af;'>Commonwealth of Massachusetts</div>");
        html.append("        <div style='font-size:16px;font-weight:700;color:#f9fafb;'>Department of Youth Services • Unit Condition Report</div>");
        html.append("        <div style='font-size:12px;color:#9ca3af;margin-top:2px;'>Program: ")
            .append(escape(program.getName()))
            .append("</div>");
        html.append("      </div>");
        html.append("    </div>");

        // Body
        html.append("    <div style='padding:20px 24px 18px;'>");
        // Priority chip
        if (effectivePriority != null && !effectivePriority.isBlank()) {
            html.append("      <div style='margin-bottom:10px;'>");
            html.append("        <span style='display:inline-block;padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;background:")
                .append(priorityBadgeColor)
                .append(";'>")
                .append(escape(effectivePriority))
                .append("</span>");
            if (effectiveCategory != null && !effectiveCategory.isBlank()) {
                html.append("        <span style='margin-left:8px;font-size:11px;color:#4b5563;text-transform:uppercase;letter-spacing:0.08em;'>")
                    .append(escape(effectiveCategory))
                    .append("</span>");
            }
            html.append("      </div>");
        }

        // Report meta
        html.append("      <div style='font-size:13px;color:#4b5563;margin-bottom:12px;'>");
        if (report != null && report.getReportDate() != null) {
            html.append("        <div><strong>Date:</strong> ")
                .append(escape(String.valueOf(report.getReportDate())))
                .append("</div>");
        }
        if (report != null && report.getShiftTime() != null) {
            html.append("        <div><strong>Shift:</strong> ")
                .append(escape(report.getShiftTime()))
                .append("</div>");
        }
        html.append("      </div>");

        String summaryBlock = !issueSummary.isBlank() ? issueSummary : legacyMessage;
        if (!summaryBlock.isBlank()) {
            html.append("      <div style='margin-top:6px;margin-bottom:12px;'>");
            html.append("        <div style='font-size:13px;font-weight:600;color:#111827;margin-bottom:4px;'>Issue Summary</div>");
            html.append("        <div style='font-size:13px;color:#4b5563;line-height:1.6;background:#f9fafb;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;'>")
                .append(escape(summaryBlock).replace("\n", "<br/>")).append("</div>");
            html.append("      </div>");
        }
        if (!additionalComments.isBlank()) {
            html.append("      <div style='margin-top:8px;margin-bottom:12px;'>");
            html.append("        <div style='font-size:13px;font-weight:600;color:#111827;margin-bottom:4px;'>Additional Comments</div>");
            html.append("        <div style='font-size:13px;color:#4b5563;line-height:1.6;background:#fefce8;border-radius:8px;padding:10px 12px;border:1px solid #eab308;'>")
                .append(escape(additionalComments).replace("\n", "<br/>")).append("</div>");
            html.append("      </div>");
        }
        if (!legacyCategoryOther.isBlank()) {
            html.append("      <div style='margin-top:6px;margin-bottom:12px;'>");
            html.append("        <div style='font-size:13px;font-weight:600;color:#111827;margin-bottom:4px;'>Other Details</div>");
            html.append("        <div style='font-size:13px;color:#4b5563;line-height:1.6;background:#f9fafb;border-radius:8px;padding:10px 12px;border:1px solid #e5e7eb;'>")
                .append(escape(legacyCategoryOther).replace("\n", "<br/>")).append("</div>");
            html.append("      </div>");
        }

        if (!senderName.isBlank() || !senderTitle.isBlank()) {
            html.append("      <div style='margin-top:12px;padding-top:10px;border-top:1px dashed #e5e7eb;font-size:12px;color:#6b7280;'>");
            html.append("        <div style='font-weight:600;color:#111827;margin-bottom:2px;'>Reported by</div>");
            html.append("        <div>").append(escape(senderName)).append("</div>");
            if (!senderTitle.isBlank()) {
                html.append("        <div style='color:#6b7280;'>").append(escape(senderTitle)).append("</div>");
            }
            html.append("      </div>");
        }

        html.append("    </div>");

        // Footer
        html.append("    <div style='padding:10px 20px 14px;border-top:1px solid #e5e7eb;background:#f9fafb;font-size:11px;color:#9ca3af;text-align:center;'>");
        html.append("      Youth Supervision Platform • Internal DYS communication");
        html.append("    </div>");

        html.append("  </div>");
        html.append("</div>");

        // Send email via MailService (Mailpit-backed)
        for (String to : emails) {
            try {
                mailService.sendRawHtml(to, finalSubject, html.toString());
            } catch (Exception ignored) {}
        }

        // Persist notification record
        ProgramUcrNotification notif = new ProgramUcrNotification();
        notif.setProgram(program);
        if (report != null) notif.setUcrReport(report);
        notif.setAlertStatus(effectivePriority != null ? effectivePriority : "");
        notif.setIssueTitle(issueTitle);
        notif.setIssueSummary(issueSummary);
        if (report != null) {
            // Approximate last reported metadata
            if (report.getReportDate() != null) {
                notif.setIssueLastReportedAt(report.getReportDate().atStartOfDay());
            }
            notif.setIssueLastReportedBy(report.getStaffName());
            notif.setIssueOccurrenceCount(1);
        }
        notif.setIssueCategory(effectiveCategory);
        notif.setPriorityLevel(effectivePriority);
        notif.setSubjectLine(finalSubject);
        notif.setAdditionalComments(additionalComments);
        notif.setNotifiedToEmails(String.join(",", emails));
        notif.setNotificationChannel("EMAIL");
        notif.setSentAt(java.time.LocalDateTime.now());
        notifications.save(notif);

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

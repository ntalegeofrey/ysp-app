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
        var p = ucrs.findByFilters(programId, (q==null||q.isBlank())? null : q, date, (status==null||status.equalsIgnoreCase("All Status")||status.isBlank())? null : status, pageable);
        Map<String,Object> out = new HashMap<>();
        out.put("content", p.getContent());
        out.put("totalElements", p.getTotalElements());
        out.put("page", p.getNumber());
        out.put("size", p.getSize());
        return ResponseEntity.ok(out);
    }

    @GetMapping("/reports/{reportId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getOne(@PathVariable("id") Long id, @PathVariable("reportId") Long reportId) {
        var r = ucrs.findOneByIdAndProgram(reportId, id);
        if (r == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(r);
    }

    @PostMapping("/reports")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> create(@PathVariable("id") Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        Optional<Program> opt = programs.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Program program = opt.get();

        ProgramUcrReport r = new ProgramUcrReport();
        r.setProgram(program);
        LocalDate date;
        try {
            Object d = body.get("reportDate");
            date = d != null ? LocalDate.parse(d.toString()) : LocalDate.now();
        } catch (Exception e) {
            date = LocalDate.now();
        }
        r.setReportDate(date);
        String shift = Objects.toString(body.get("shift"), null);
        r.setShift(shift);

        // Enforce one UCR per program/date/shift
        if (shift != null && !shift.isBlank()) {
            ProgramUcrReport existing = ucrs.findFirstByProgram_IdAndReportDateAndShift(id, date, shift);
            if (existing != null) {
                Map<String, Object> err = new HashMap<>();
                err.put("message", "UCR report already exists for this date and shift. Please edit the existing report.");
                err.put("existingId", existing.getId());
                return ResponseEntity.status(409).body(err);
            }
        }
        // Prefer reporterName from authenticated user if available
        String reporter = Objects.toString(body.get("reporterName"), null);
        if ((reporter == null || reporter.isBlank()) && auth != null && auth.getName() != null) {
            reporter = users.findByEmail(auth.getName()).map(u -> {
                String fn = u.getFullName();
                return (fn != null && !fn.isBlank()) ? fn : u.getEmail();
            }).orElse(auth.getName());
        }
        r.setReporterName(reporter);
        r.setStatus(Objects.toString(body.get("status"), null));
        r.setIssuesSummary(Objects.toString(body.get("issuesSummary"), null));

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
        if (body.containsKey("shift")) r.setShift(Objects.toString(body.get("shift"), null));
        if (body.containsKey("reporterName")) r.setReporterName(Objects.toString(body.get("reporterName"), null));
        if (body.containsKey("status")) r.setStatus(Objects.toString(body.get("status"), null));
        if (body.containsKey("issuesSummary")) r.setIssuesSummary(Objects.toString(body.get("issuesSummary"), null));

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
        out.put("critical", ucrs.countCritical(programId));
        out.put("pending", ucrs.countPending(programId));
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

    @GetMapping("/monthly-chart")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> monthlyChart(@PathVariable("id") Long programId, @RequestParam(value = "year", defaultValue = "0") int year) {
        if (year <= 0) year = java.time.Year.now().getValue();
        var results = ucrs.findMonthlyIssueCounts(programId, year);
        
        // Initialize arrays for 12 months
        int[] critical = new int[12];
        int[] high = new int[12];
        int[] medium = new int[12];
        
        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue() - 1; // 0-based index
            String status = (String) row[1];
            int count = ((Number) row[2]).intValue();
            
            if (month >= 0 && month < 12) {
                if ("critical".equals(status)) {
                    critical[month] = count;
                } else if ("high".equals(status)) {
                    high[month] = count;
                } else if ("medium".equals(status)) {
                    medium[month] = count;
                }
            }
        }
        
        Map<String, Object> out = new HashMap<>();
        out.put("critical", critical);
        out.put("high", high);
        out.put("medium", medium);
        out.put("year", year);
        return ResponseEntity.ok(out);
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

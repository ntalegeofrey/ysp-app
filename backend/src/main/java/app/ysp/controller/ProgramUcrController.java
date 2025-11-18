package app.ysp.controller;

import app.ysp.entity.Program;
import app.ysp.entity.ProgramUcrReport;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramUcrReportRepository;
import app.ysp.repo.UserRepository;
import app.ysp.service.SseHub;
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

    public ProgramUcrController(ProgramRepository programs, ProgramUcrReportRepository ucrs, SseHub sseHub, UserRepository users) {
        this.programs = programs;
        this.ucrs = ucrs;
        this.sseHub = sseHub;
        this.users = users;
    }

    @GetMapping("/reports")
    public ResponseEntity<?> list(@PathVariable("id") Long programId, Authentication auth) {
        // Any authenticated user attached to the program should be able to view; attachment gate is in layout already.
        if (programId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(ucrs.findAllByProgramOrder(programId));
    }

    @GetMapping("/reports/page")
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
    public ResponseEntity<?> getOne(@PathVariable("id") Long id, @PathVariable("reportId") Long reportId) {
        var r = ucrs.findOneByIdAndProgram(reportId, id);
        if (r == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(r);
    }

    @PostMapping("/reports")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or @securityService.isProgramMember(#id, authentication)")
    public ResponseEntity<?> create(@PathVariable("id") Long id, @RequestBody Map<String, Object> body, Authentication auth) {
        Optional<Program> opt = programs.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Program program = opt.get();

        ProgramUcrReport r = new ProgramUcrReport();
        r.setProgram(program);
        try {
            Object d = body.get("reportDate");
            LocalDate date = d != null ? LocalDate.parse(d.toString()) : LocalDate.now();
            r.setReportDate(date);
        } catch (Exception e) {
            r.setReportDate(LocalDate.now());
        }
        r.setShift(Objects.toString(body.get("shift"), null));
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
        Object payload = body.get("payload");
        if (payload != null) {
            try { r.setPayloadJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(payload)); } catch (Exception ignored) {}
        }

        ProgramUcrReport saved = ucrs.save(r);
        try { sseHub.broadcast(Map.of("type","programs.ucr.created","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/reports/{reportId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication)")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @PathVariable("reportId") Long reportId, @RequestBody Map<String, Object> body) {
        Optional<ProgramUcrReport> opt = ucrs.findById(reportId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        ProgramUcrReport r = opt.get();
        if (r.getProgram() == null || r.getProgram().getId() == null || !Objects.equals(r.getProgram().getId(), id)) {
            return ResponseEntity.notFound().build();
        }
        if (body.containsKey("reportDate")) {
            try { r.setReportDate(LocalDate.parse(Objects.toString(body.get("reportDate"), null))); } catch (Exception ignored) {}
        }
        if (body.containsKey("shift")) r.setShift(Objects.toString(body.get("shift"), null));
        if (body.containsKey("reporterName")) r.setReporterName(Objects.toString(body.get("reporterName"), null));
        if (body.containsKey("status")) r.setStatus(Objects.toString(body.get("status"), null));
        if (body.containsKey("issuesSummary")) r.setIssuesSummary(Objects.toString(body.get("issuesSummary"), null));
        if (body.containsKey("payload")) {
            Object payload = body.get("payload");
            if (payload != null) try { r.setPayloadJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(payload)); } catch (Exception ignored) {}
        }
        ProgramUcrReport saved = ucrs.save(r);
        try { sseHub.broadcast(Map.of("type","programs.ucr.updated","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats(@PathVariable("id") Long id) {
        YearMonth now = YearMonth.now();
        LocalDate start = now.atDay(1);
        LocalDate end = now.atEndOfMonth();
        Map<String, Object> out = new HashMap<>();
        out.put("total", ucrs.countByProgramId(id));
        out.put("critical", ucrs.countCritical(id));
        out.put("pending", ucrs.countPending(id));
        out.put("monthCount", ucrs.countInRange(id, start, end));
        return ResponseEntity.ok(out);
    }

    @GetMapping("/open-issues")
    public ResponseEntity<?> openIssues(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size
    ) {
        var p = ucrs.findOpenIssues(id, PageRequest.of(Math.max(0,page), Math.max(1,size)));
        Map<String,Object> out = new HashMap<>();
        out.put("content", p.getContent());
        out.put("totalElements", p.getTotalElements());
        return ResponseEntity.ok(out);
    }
}

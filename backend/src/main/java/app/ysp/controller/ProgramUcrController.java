package app.ysp.controller;

import app.ysp.entity.Program;
import app.ysp.entity.ProgramUcrReport;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramUcrReportRepository;
import app.ysp.service.SseHub;
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

    public ProgramUcrController(ProgramRepository programs, ProgramUcrReportRepository ucrs, SseHub sseHub) {
        this.programs = programs;
        this.ucrs = ucrs;
        this.sseHub = sseHub;
    }

    @GetMapping("/reports")
    public ResponseEntity<?> list(@PathVariable("id") Long programId, Authentication auth) {
        // Any authenticated user attached to the program should be able to view; attachment gate is in layout already.
        if (programId == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(ucrs.findAllByProgramOrder(programId));
    }

    @PostMapping("/reports")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication)")
    public ResponseEntity<?> create(@PathVariable("id") Long id, @RequestBody Map<String, Object> body) {
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
        r.setReporterName(Objects.toString(body.get("reporterName"), null));
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
}

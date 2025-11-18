package app.ysp.controller;

import app.ysp.entity.FirePlan;
import app.ysp.entity.FireDrillReport;
import app.ysp.entity.Program;
import app.ysp.repo.FirePlanRepository;
import app.ysp.repo.FireDrillReportRepository;
import app.ysp.repo.ProgramRepository;
import app.ysp.service.SseHub;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/programs/{id}/fire-plan")
public class FirePlanController {

    private final ProgramRepository programs;
    private final FirePlanRepository firePlans;
    private final FireDrillReportRepository drillReports;
    private final SseHub sseHub;

    public FirePlanController(ProgramRepository programs, FirePlanRepository firePlans, FireDrillReportRepository drillReports, SseHub sseHub) {
        this.programs = programs;
        this.firePlans = firePlans;
        this.drillReports = drillReports;
        this.sseHub = sseHub;
    }

    @GetMapping("/current")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or @securityService.isProgramMember(#id, authentication)")
    public ResponseEntity<?> getCurrentPlan(@PathVariable("id") Long id) {
        Optional<FirePlan> opt = firePlans.findActivePlan(id);
        if (opt.isEmpty()) {
            Map<String, Object> empty = new HashMap<>();
            empty.put("id", null);
            empty.put("status", "No Active Plan");
            return ResponseEntity.ok(empty);
        }
        return ResponseEntity.ok(opt.get());
    }

    @PostMapping("/generate")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication)")
    public ResponseEntity<?> generatePlan(@PathVariable("id") Long id, @RequestBody Map<String, Object> body) {
        Optional<Program> progOpt = programs.findById(id);
        if (progOpt.isEmpty()) return ResponseEntity.notFound().build();

        firePlans.findActivePlan(id).ifPresent(existing -> {
            existing.setStatus("Archived");
            firePlans.save(existing);
        });

        FirePlan plan = new FirePlan();
        plan.setProgram(progOpt.get());
        plan.setGeneratedDate(LocalDate.now());
        plan.setShift(Objects.toString(body.get("shift"), "Day"));
        plan.setTotalStaff(body.containsKey("totalStaff") ? Integer.parseInt(Objects.toString(body.get("totalStaff"), "0")) : 0);
        plan.setTotalResidents(body.containsKey("totalResidents") ? Integer.parseInt(Objects.toString(body.get("totalResidents"), "0")) : 0);
        plan.setSpecialAssignments(body.containsKey("specialAssignments") ? Integer.parseInt(Objects.toString(body.get("specialAssignments"), "0")) : 0);
        plan.setPrimaryRoute(Objects.toString(body.get("primaryRoute"), null));
        plan.setSecondaryRoute(Objects.toString(body.get("secondaryRoute"), null));
        plan.setStatus("Active");

        Object staffAssignments = body.get("staffAssignments");
        if (staffAssignments != null) {
            try { plan.setStaffAssignmentsJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(staffAssignments)); } catch (Exception ignored) {}
        }

        Object residentStatus = body.get("residentStatus");
        if (residentStatus != null) {
            try { plan.setResidentStatusJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(residentStatus)); } catch (Exception ignored) {}
        }

        Object routeConfig = body.get("routeConfig");
        if (routeConfig != null) {
            try { plan.setRouteConfigJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(routeConfig)); } catch (Exception ignored) {}
        }

        FirePlan saved = firePlans.save(plan);
        try { sseHub.broadcast(Map.of("type","programs.fireplan.generated","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @PatchMapping("/current")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication)")
    public ResponseEntity<?> updateCurrentPlan(@PathVariable("id") Long id, @RequestBody Map<String, Object> body) {
        Optional<FirePlan> opt = firePlans.findActivePlan(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        FirePlan plan = opt.get();
        if (body.containsKey("totalStaff")) plan.setTotalStaff(Integer.parseInt(Objects.toString(body.get("totalStaff"), "0")));
        if (body.containsKey("totalResidents")) plan.setTotalResidents(Integer.parseInt(Objects.toString(body.get("totalResidents"), "0")));
        if (body.containsKey("specialAssignments")) plan.setSpecialAssignments(Integer.parseInt(Objects.toString(body.get("specialAssignments"), "0")));
        if (body.containsKey("primaryRoute")) plan.setPrimaryRoute(Objects.toString(body.get("primaryRoute"), null));
        if (body.containsKey("secondaryRoute")) plan.setSecondaryRoute(Objects.toString(body.get("secondaryRoute"), null));

        if (body.containsKey("staffAssignments")) {
            Object staffAssignments = body.get("staffAssignments");
            try { plan.setStaffAssignmentsJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(staffAssignments)); } catch (Exception ignored) {}
        }

        if (body.containsKey("residentStatus")) {
            Object residentStatus = body.get("residentStatus");
            try { plan.setResidentStatusJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(residentStatus)); } catch (Exception ignored) {}
        }

        if (body.containsKey("routeConfig")) {
            Object routeConfig = body.get("routeConfig");
            try { plan.setRouteConfigJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(routeConfig)); } catch (Exception ignored) {}
        }

        FirePlan saved = firePlans.save(plan);
        try { sseHub.broadcast(Map.of("type","programs.fireplan.updated","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/drills")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or @securityService.isProgramMember(#id, authentication)")
    public ResponseEntity<?> listDrills(
            @PathVariable("id") Long id,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "drillType", required = false) String drillType,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<FireDrillReport> p = drillReports.findByFilters(id, q, drillType, PageRequest.of(Math.max(0, page), Math.max(1, size)));
        Map<String, Object> out = new HashMap<>();
        out.put("content", p.getContent());
        out.put("totalElements", p.getTotalElements());
        out.put("totalPages", p.getTotalPages());
        out.put("currentPage", p.getNumber());
        return ResponseEntity.ok(out);
    }

    @GetMapping("/drills/{drillId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or @securityService.isProgramMember(#id, authentication)")
    public ResponseEntity<?> getDrill(@PathVariable("id") Long id, @PathVariable("drillId") Long drillId) {
        Optional<FireDrillReport> opt = drillReports.findByIdAndProgramId(drillId, id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(opt.get());
    }

    @PostMapping("/drills")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or @securityService.isProgramMember(#id, authentication)")
    public ResponseEntity<?> createDrill(@PathVariable("id") Long id, @RequestBody Map<String, Object> body) {
        Optional<Program> progOpt = programs.findById(id);
        if (progOpt.isEmpty()) return ResponseEntity.notFound().build();

        FireDrillReport report = new FireDrillReport();
        report.setProgram(progOpt.get());

        if (body.containsKey("drillDate")) {
            try { report.setDrillDate(LocalDate.parse(Objects.toString(body.get("drillDate"), null))); } catch (Exception ignored) {}
        }
        if (body.containsKey("drillTime")) {
            try { report.setDrillTime(LocalTime.parse(Objects.toString(body.get("drillTime"), null))); } catch (Exception ignored) {}
        }
        report.setDrillType(Objects.toString(body.get("drillType"), null));
        report.setShift(Objects.toString(body.get("shift"), null));
        report.setShiftSupervisor(Objects.toString(body.get("shiftSupervisor"), null));
        report.setReportCompletedBy(Objects.toString(body.get("reportCompletedBy"), null));
        report.setTotalEvacuationTime(Objects.toString(body.get("totalEvacuationTime"), null));
        report.setWeatherConditions(Objects.toString(body.get("weatherConditions"), null));

        if (body.containsKey("totalStaffPresent")) {
            try { report.setTotalStaffPresent(Integer.parseInt(Objects.toString(body.get("totalStaffPresent"), "0"))); } catch (Exception ignored) {}
        }
        if (body.containsKey("totalResidentsPresent")) {
            try { report.setTotalResidentsPresent(Integer.parseInt(Objects.toString(body.get("totalResidentsPresent"), "0"))); } catch (Exception ignored) {}
        }

        report.setOverallPerformance(Objects.toString(body.get("overallPerformance"), null));
        report.setIssuesIdentified(Objects.toString(body.get("issuesIdentified"), null));
        report.setRecommendations(Objects.toString(body.get("recommendations"), null));

        Object routePerformance = body.get("routePerformance");
        if (routePerformance != null) {
            try { report.setRoutePerformanceJson(com.fasterxml.jackson.databind.json.JsonMapper.builder().build().writeValueAsString(routePerformance)); } catch (Exception ignored) {}
        }

        if (body.containsKey("certificationComplete")) {
            report.setCertificationComplete(Boolean.parseBoolean(Objects.toString(body.get("certificationComplete"), "false")));
        }
        report.setDigitalSignature(Objects.toString(body.get("digitalSignature"), null));
        if (body.containsKey("signatureDatetime")) {
            try { report.setSignatureDatetime(LocalDateTime.parse(Objects.toString(body.get("signatureDatetime"), null))); } catch (Exception ignored) {}
        }
        report.setStatus(Objects.toString(body.get("status"), "Successful"));

        FireDrillReport saved = drillReports.save(report);
        try { sseHub.broadcast(Map.of("type","programs.firedrill.created","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }
}

package app.ysp.controller;

import app.ysp.entity.Program;
import app.ysp.entity.ProgramAssignment;
import app.ysp.entity.ProgramResident;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repo.ProgramResidentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import app.ysp.service.SseHub;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/programs")
public class ProgramController {

    private final ProgramRepository programs;
    private final ProgramAssignmentRepository assignments;
    private final UserRepository users;
    private final ProgramResidentRepository residents;
    private final SseHub sseHub;

    public ProgramController(ProgramRepository programs, ProgramAssignmentRepository assignments, UserRepository users, ProgramResidentRepository residents, SseHub sseHub) {
        this.programs = programs;
        this.assignments = assignments;
        this.users = users;
        this.residents = residents;
        this.sseHub = sseHub;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR')")
    public List<Program> all() {
        return programs.findAll();
    }

    // Public discoverability list: any authenticated user can search all programs
    @GetMapping("/public")
    public List<Program> allPublic() {
        return programs.findAll();
    }

    @GetMapping("/active")
    public List<Program> active() {
        return programs.findByActiveTrue();
    }

    @GetMapping("/my")
    public List<Program> myPrograms(Authentication auth) {
        if (auth == null) return List.of();
        String email = auth.getName();
        List<Long> ids = assignments.findProgramIdsByUserEmail(email);
        if (ids.isEmpty()) return List.of();
        return programs.findAllById(ids);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Program> one(@PathVariable Long id) {
        return programs.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR')")
    public ResponseEntity<Program> create(@RequestBody Program body) {
        Program saved = programs.save(body);
        return ResponseEntity.created(URI.create("/programs/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR')")
    public ResponseEntity<Program> update(@PathVariable Long id, @RequestBody Program body) {
        return programs.findById(id)
                .map(p -> {
                    body.setId(p.getId());
                    Program saved = programs.save(body);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/residents/{residentPk}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or (@securityService.isProgramMember(#id, authentication) and @securityService.hasOperation('op.EDIT_RESIDENT', authentication))")
    public ResponseEntity<?> updateResident(@PathVariable Long id, @PathVariable("residentPk") Long residentPk, @RequestBody Map<String, Object> body) {
        Optional<ProgramResident> opt = residents.findById(residentPk);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        ProgramResident pr = opt.get();
        if (pr.getProgram() == null || pr.getProgram().getId() == null || !Objects.equals(pr.getProgram().getId(), id)) {
            return ResponseEntity.notFound().build();
        }
        if (body.containsKey("room")) pr.setRoom(Objects.toString(body.get("room"), null));
        if (body.containsKey("status")) pr.setStatus(Objects.toString(body.get("status"), null));
        if (body.containsKey("advocate")) pr.setAdvocate(Objects.toString(body.get("advocate"), null));
        if (body.containsKey("admissionDate")) {
            Object v = body.get("admissionDate");
            if (v != null) {
                try {
                    pr.setAdmissionDate(java.time.LocalDate.parse(v.toString()));
                } catch (Exception ignored) {}
            }
        }
        if (body.containsKey("temporaryLocation")) pr.setTemporaryLocation(Objects.toString(body.get("temporaryLocation"), null));
        ProgramResident saved = residents.save(pr);
        try { sseHub.broadcast(java.util.Map.of("type","programs.residents.updated","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}/residents/{residentPk}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or (@securityService.isProgramMember(#id, authentication) and @securityService.hasOperation('op.DISCHARGE_RESIDENT', authentication))")
    public ResponseEntity<?> removeResident(@PathVariable Long id, @PathVariable("residentPk") Long residentPk) {
        Optional<ProgramResident> opt = residents.findById(residentPk);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        ProgramResident pr = opt.get();
        if (pr.getProgram() == null || pr.getProgram().getId() == null || !Objects.equals(pr.getProgram().getId(), id)) {
            return ResponseEntity.notFound().build();
        }
        residents.delete(pr);
        try { sseHub.broadcast(java.util.Map.of("type","programs.residents.removed","programId", id, "id", residentPk)); } catch (Exception ignored) {}
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/assignments")
    public List<ProgramAssignment> getAssignments(@PathVariable Long id) {
        return assignments.findByProgram_Id(id);
    }

    @PostMapping("/{id}/assignments")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication)")
    public ResponseEntity<?> setAssignments(@PathVariable Long id, @RequestBody AssignmentsPayload payload) {
        Optional<Program> opt = programs.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Program program = opt.get();
        // Clear existing
        List<ProgramAssignment> existing = assignments.findByProgram_Id(id);
        if (!existing.isEmpty()) assignments.deleteAll(existing);
        // Insert new
        List<ProgramAssignment> toSave = new ArrayList<>();
        for (AssignmentItem item : payload.assignments) {
            ProgramAssignment pa = new ProgramAssignment();
            pa.setProgram(program);
            pa.setRoleType(item.roleType);
            pa.setUserEmail(item.userEmail);
            pa.setUserId(item.userId);
            toSave.add(pa);
        }
        assignments.saveAll(toSave);
        try { sseHub.broadcast(java.util.Map.of("type","programs.assignments.updated","programId", id)); } catch (Exception ignored) {}
        return ResponseEntity.ok(Map.of("count", toSave.size()));
    }

    // Residents per program
    @GetMapping("/{id}/residents")
    public List<ProgramResident> getResidents(@PathVariable Long id) {
        return residents.findByProgram_Id(id);
    }

    @PostMapping("/{id}/residents")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_ADMINISTRATOR') or @securityService.isProgramManager(#id, authentication) or (@securityService.isProgramMember(#id, authentication) and @securityService.hasOperation('op.ADD_RESIDENT', authentication))")
    public ResponseEntity<?> addResident(@PathVariable Long id, @RequestBody ProgramResident body) {
        return programs.findById(id)
                .map(p -> {
                    body.setId(null);
                    body.setProgram(p);
                    // Auto-generate 6-digit incremental residentId if not provided
                    String provided = body.getResidentId();
                    if (provided == null || provided.trim().isEmpty()) {
                        Integer max = residents.findMaxNumericResidentForProgram(id);
                        int next = (max == null ? 0 : max) + 1;
                        String rid = String.format("%06d", next);
                        body.setResidentId(rid);
                    }
                    ProgramResident saved = residents.save(body);
                    try { sseHub.broadcast(java.util.Map.of("type","programs.residents.added","programId", id, "id", saved.getId())); } catch (Exception ignored) {}
                    return ResponseEntity.created(URI.create("/programs/" + id + "/residents/" + saved.getId())).body(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/residents/next-id")
    public ResponseEntity<?> nextResidentId(@PathVariable Long id) {
        Optional<Program> p = programs.findById(id);
        if (p.isEmpty()) return ResponseEntity.notFound().build();
        Integer max = residents.findMaxNumericResidentForProgram(id);
        int next = (max == null ? 0 : max) + 1;
        String rid = String.format("%06d", next);
        return ResponseEntity.ok(java.util.Map.of("nextId", rid));
    }

    public static class AssignmentsPayload {
        public List<AssignmentItem> assignments = List.of();
    }

    public static class AssignmentItem {
        public Long userId;
        public String userEmail;
        public String roleType; // REGIONAL_ADMIN, PROGRAM_DIRECTOR, ASSISTANT_DIRECTOR, STAFF
    }
}

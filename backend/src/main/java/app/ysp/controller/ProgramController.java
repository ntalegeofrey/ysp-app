package app.ysp.controller;

import app.ysp.entity.Program;
import app.ysp.entity.ProgramAssignment;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("/programs")
public class ProgramController {

    private final ProgramRepository programs;
    private final ProgramAssignmentRepository assignments;
    private final UserRepository users;

    public ProgramController(ProgramRepository programs, ProgramAssignmentRepository assignments, UserRepository users) {
        this.programs = programs;
        this.assignments = assignments;
        this.users = users;
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
        return ResponseEntity.ok(Map.of("count", toSave.size()));
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

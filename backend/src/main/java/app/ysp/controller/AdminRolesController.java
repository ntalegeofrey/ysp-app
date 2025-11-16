package app.ysp.controller;

import app.ysp.domain.Role;
import app.ysp.domain.RolePermission;
import app.ysp.dto.RoleDto;
import app.ysp.dto.RolePermissionDto;
import app.ysp.repo.RolePermissionRepository;
import app.ysp.repo.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/roles")
@PreAuthorize("hasRole('ADMIN')")
public class AdminRolesController {
    private final RoleRepository roles;
    private final RolePermissionRepository perms;

    public AdminRolesController(RoleRepository roles, RolePermissionRepository perms) {
        this.roles = roles;
        this.perms = perms;
    }

    @GetMapping
    public List<RoleDto> list() {
        return roles.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<RoleDto> create(@RequestBody RoleDto req) {
        Role r = new Role();
        r.setName(req.getName());
        r.setDescription(req.getDescription());
        r.setActive(req.getActive() == null ? true : req.getActive());
        r = roles.save(r);
        return ResponseEntity.created(URI.create("/admin/roles/" + r.getId())).body(toDto(r));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RoleDto> update(@PathVariable Long id, @RequestBody RoleDto req) {
        return roles.findById(id)
                .map(r -> {
                    if (req.getName() != null) r.setName(req.getName());
                    if (req.getDescription() != null) r.setDescription(req.getDescription());
                    if (req.getActive() != null) r.setActive(req.getActive());
                    return ResponseEntity.ok(toDto(roles.save(r)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!roles.existsById(id)) return ResponseEntity.notFound().build();
        roles.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/permissions")
    public ResponseEntity<List<RolePermissionDto>> getPermissions(@PathVariable Long id) {
        return roles.findById(id)
                .map(r -> ResponseEntity.ok(
                        perms.findByRole(r).stream().map(this::toDto).collect(Collectors.toList())
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<List<RolePermissionDto>> putPermissions(@PathVariable Long id, @RequestBody List<RolePermissionDto> body) {
        return roles.findById(id)
                .map(r -> {
                    var existing = perms.findByRole(r);
                    var byModule = existing.stream().collect(Collectors.toMap(RolePermission::getModule, rp -> rp));
                    for (RolePermissionDto dto : body) {
                        RolePermission rp = byModule.get(dto.getModule());
                        if (rp == null) {
                            rp = new RolePermission();
                            rp.setRole(r);
                            rp.setModule(dto.getModule());
                        }
                        rp.setAccess(dto.getAccess());
                        perms.save(rp);
                    }
                    var out = perms.findByRole(r).stream().map(this::toDto).collect(Collectors.toList());
                    return ResponseEntity.ok(out);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private RoleDto toDto(Role r) {
        RoleDto d = new RoleDto();
        d.setId(r.getId());
        d.setName(r.getName());
        d.setDescription(r.getDescription());
        d.setActive(r.getActive());
        return d;
    }

    private RolePermissionDto toDto(RolePermission p) {
        RolePermissionDto d = new RolePermissionDto();
        d.setModule(p.getModule());
        d.setAccess(p.getAccess());
        return d;
    }
}

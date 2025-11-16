package app.ysp.controller;

import app.ysp.domain.Role;
import app.ysp.domain.RolePermission;
import app.ysp.domain.User;
import app.ysp.repo.RolePermissionRepository;
import app.ysp.repo.RoleRepository;
import app.ysp.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/permissions")
public class PermissionsController {
    private final UserRepository users;
    private final RoleRepository roles;
    private final RolePermissionRepository perms;

    public PermissionsController(UserRepository users, RoleRepository roles, RolePermissionRepository perms) {
        this.users = users;
        this.roles = roles;
        this.perms = perms;
    }

    @GetMapping("/check")
    public ResponseEntity<?> check(@RequestParam("module") String module, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        String email = auth.getName();
        User u = users.findByEmailIgnoreCase(email).orElse(null);
        if (u == null) return ResponseEntity.status(401).build();

        // Resolve role
        String roleName = u.getRole();
        if (roleName == null) roleName = "user";
        Role role = roles.findByName(roleName).orElse(null);
        if (role == null) {
            // No matching role: treat as no access
            return ResponseEntity.ok(Map.of(
                    "module", module,
                    "access", "NONE",
                    "allowed", false
            ));
        }
        String access = "NONE";
        for (RolePermission rp : perms.findByRole(role)) {
            if (module.equalsIgnoreCase(rp.getModule())) {
                access = rp.getAccess();
                break;
            }
        }
        boolean allowed = "FULL".equalsIgnoreCase(access) || "EDIT".equalsIgnoreCase(access) || "VIEW".equalsIgnoreCase(access);
        return ResponseEntity.ok(Map.of(
                "module", module,
                "access", access,
                "allowed", allowed
        ));
    }
}

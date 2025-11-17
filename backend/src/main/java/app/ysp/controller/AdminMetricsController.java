package app.ysp.controller;

import app.ysp.repo.RolePermissionRepository;
import app.ysp.repo.RoleRepository;
import app.ysp.repo.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/metrics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMetricsController {

    private final UserRepository users;
    private final RoleRepository roles;
    private final RolePermissionRepository rolePerms;

    public AdminMetricsController(UserRepository users, RoleRepository roles, RolePermissionRepository rolePerms) {
        this.users = users;
        this.roles = roles;
        this.rolePerms = rolePerms;
    }

    @GetMapping
    public Map<String, Object> metrics() {
        Map<String, Object> out = new HashMap<>();
        long usersCount = users.count();
        long activeRoles = roles.countByActiveTrue();
        long permissionsCount = rolePerms.count();
        long pendingReviews = users.countByMustChangePasswordTrue();
        out.put("usersCount", usersCount);
        out.put("activeRoles", activeRoles);
        out.put("permissionsCount", permissionsCount);
        out.put("pendingReviews", pendingReviews);
        return out;
    }
}

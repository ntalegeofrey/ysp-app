package app.ysp.security;

import app.ysp.domain.Role;
import app.ysp.domain.RolePermission;
import app.ysp.domain.User;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.repo.RolePermissionRepository;
import app.ysp.repo.RoleRepository;
import app.ysp.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("securityService")
public class SecurityService {
    private final ProgramAssignmentRepository assignments;
    private final UserRepository users;
    private final RoleRepository roles;
    private final RolePermissionRepository perms;

    public SecurityService(ProgramAssignmentRepository assignments, UserRepository users, RoleRepository roles, RolePermissionRepository perms) {
        this.assignments = assignments;
        this.users = users;
        this.roles = roles;
        this.perms = perms;
    }

    public boolean isProgramMember(Long programId, Authentication auth) {
        if (auth == null || programId == null) return false;
        String email = auth.getName();
        return assignments.findByProgram_Id(programId)
                .stream()
                .anyMatch(pa -> email != null && email.equalsIgnoreCase(pa.getUserEmail()));
    }

    public boolean isProgramManager(Long programId, Authentication auth) {
        if (auth == null || programId == null) return false;
        String email = auth.getName();
        return assignments.findByProgram_Id(programId)
                .stream()
                .anyMatch(pa -> email != null && email.equalsIgnoreCase(pa.getUserEmail()) && isManagerRole(pa.getRoleType()));
    }

    public boolean hasOperation(String moduleKey, Authentication auth) {
        if (auth == null || auth.getName() == null) return false;
        String email = auth.getName();
        User u = users.findByEmailIgnoreCase(email).orElse(null);
        if (u == null) return false;
        String roleName = u.getRole();
        if (roleName == null) roleName = "user";
        Role role = roles.findByName(roleName).orElse(null);
        if (role == null) return false;
        for (RolePermission rp : perms.findByRole(role)) {
            if (moduleKey.equalsIgnoreCase(rp.getModule())) {
                String access = rp.getAccess();
                return access != null && ("FULL".equalsIgnoreCase(access) || "EDIT".equalsIgnoreCase(access) || "VIEW".equalsIgnoreCase(access));
            }
        }
        return false;
    }

    private boolean isManagerRole(String roleType) {
        if (roleType == null) return false;
        String r = roleType.toUpperCase();
        return r.equals("PROGRAM_DIRECTOR") || r.equals("ASSISTANT_DIRECTOR") || r.equals("REGIONAL_ADMIN");
    }
}

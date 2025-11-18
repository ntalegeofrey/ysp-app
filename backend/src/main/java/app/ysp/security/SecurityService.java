package app.ysp.security;

import app.ysp.repo.ProgramAssignmentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("securityService")
public class SecurityService {
    private final ProgramAssignmentRepository assignments;

    public SecurityService(ProgramAssignmentRepository assignments) {
        this.assignments = assignments;
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

    private boolean isManagerRole(String roleType) {
        if (roleType == null) return false;
        String r = roleType.toUpperCase();
        return r.equals("PROGRAM_DIRECTOR") || r.equals("ASSISTANT_DIRECTOR") || r.equals("REGIONAL_ADMIN");
    }
}

package app.ysp.controller;

import app.ysp.dto.*;
import app.ysp.service.AuthService;
import app.ysp.service.OneTimeLoginService;
import app.ysp.repo.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final OneTimeLoginService oneTimeLoginService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, OneTimeLoginService oneTimeLoginService, UserRepository userRepository) {
        this.authService = authService;
        this.oneTimeLoginService = oneTimeLoginService;
        this.userRepository = userRepository;
    }

    @Value("${app.admin.email}")
    private String adminEmail;
    @Value("${app.admin.password}")
    private String adminPassword;

    @PostConstruct
    public void seedAdmin() {
        authService.ensureAdminSeed(adminEmail, adminPassword);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        boolean ok = authService.handleLogin(request);
        if (!ok) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(new TokenResponse(true));
    }

    @PostMapping("/mfa/send")
    public ResponseEntity<?> resend(@Valid @RequestBody MfaSendRequest request) {
        boolean ok = authService.resendMfa(request.getEmail());
        if (!ok) return ResponseEntity.status(404).build();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mfa/verify")
    public ResponseEntity<TokenResponse> verify(@Valid @RequestBody MfaVerifyRequest request) {
        String token = authService.verifyMfa(request.getEmail(), request.getCode());
        if (token == null) return ResponseEntity.status(401).build();
        var resp = new TokenResponse(token);
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> resp.setRequiresPasswordUpdate(Boolean.TRUE.equals(u.getMustChangePassword())));
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/password/update")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest req) {
        boolean ok = oneTimeLoginService.updatePasswordByToken(req.getToken(), req.getNewPassword());
        if (!ok) return ResponseEntity.status(400).build();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return ResponseEntity.status(401).build();
        return userRepository.findByEmail(auth.getName())
                .map(u -> {
                    var r = new UserResponse();
                    r.setId(u.getId());
                    r.setEmail(u.getEmail());
                    r.setRole(u.getRole());
                    r.setFullName(u.getFullName());
                    r.setJobTitle(u.getJobTitle());
                    r.setEmployeeNumber(u.getEmployeeNumber());
                    r.setEnabled(u.getEnabled());
                    r.setMustChangePassword(u.getMustChangePassword());
                    r.setCreatedAt(u.getCreatedAt());
                    return ResponseEntity.ok(r);
                })
                .orElse(ResponseEntity.status(404).build());
    }
}

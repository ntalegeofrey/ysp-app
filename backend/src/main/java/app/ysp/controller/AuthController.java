package app.ysp.controller;

import app.ysp.dto.*;
import app.ysp.service.AuthService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

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
        return ResponseEntity.ok(new TokenResponse(token));
    }
}

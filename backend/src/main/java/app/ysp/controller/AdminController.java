package app.ysp.controller;

import app.ysp.domain.User;
import app.ysp.dto.CreateUserRequest;
import app.ysp.dto.UpdateUserRequest;
import app.ysp.dto.UserResponse;
import app.ysp.repo.UserRepository;
import app.ysp.service.OneTimeLoginService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final UserRepository userRepository;
    private final OneTimeLoginService otlService;

    public AdminController(UserRepository userRepository, OneTimeLoginService otlService) {
        this.userRepository = userRepository;
        this.otlService = otlService;
    }

    @GetMapping
    public List<UserResponse> list() {
        return userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
        User u = new User();
        u.setEmail(req.getEmail());
        u.setRole(req.getRole() == null ? "user" : req.getRole());
        u.setEnabled(true);
        u.setMustChangePassword(true);
        // Placeholder password until set; not used because mustChangePassword=true
        u.setPasswordHash("!unset!");
        u = userRepository.save(u);
        if (req.isSendOneTimeLogin()) {
            otlService.createAndEmailToken(u.getId(), 1800);
        }
        return ResponseEntity.created(URI.create("/admin/users/" + u.getId())).body(toDto(u));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        return userRepository.findById(id)
                .map(u -> {
                    if (req.getRole() != null) u.setRole(req.getRole());
                    if (req.getEnabled() != null) u.setEnabled(req.getEnabled());
                    if (req.getMustChangePassword() != null) u.setMustChangePassword(req.getMustChangePassword());
                    User saved = userRepository.save(u);
                    if (Boolean.TRUE.equals(req.getSendOneTimeLogin())) {
                        otlService.createAndEmailToken(saved.getId(), 1800);
                    }
                    return ResponseEntity.ok(toDto(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/otl")
    public ResponseEntity<?> sendOtl(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> {
                    otlService.createAndEmailToken(u.getId(), 1800);
                    return ResponseEntity.accepted().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private UserResponse toDto(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole());
        r.setEnabled(u.getEnabled());
        r.setMustChangePassword(u.getMustChangePassword());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}

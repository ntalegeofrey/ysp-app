package app.ysp.controller;

import app.ysp.domain.User;
import app.ysp.dto.UserResponse;
import app.ysp.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@PreAuthorize("isAuthenticated()")
public class UsersController {
    private final UserRepository users;

    public UsersController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> search(@RequestParam(name = "q", required = false) String q) {
        String needle = q == null ? "" : q.trim().toLowerCase();
        List<User> all = users.findAll();
        List<User> filtered = all.stream().filter(u ->
                needle.isEmpty()
                        || (u.getFullName() != null && u.getFullName().toLowerCase().contains(needle))
                        || (u.getEmail() != null && u.getEmail().toLowerCase().contains(needle))
        ).limit(100).collect(Collectors.toList());
        List<UserResponse> out = filtered.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(out);
    }

    private UserResponse toDto(User u) {
        UserResponse r = new UserResponse();
        r.setId(u.getId());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole());
        r.setFullName(u.getFullName());
        r.setJobTitle(u.getJobTitle());
        r.setEmployeeNumber(u.getEmployeeNumber());
        r.setEnabled(u.getEnabled());
        r.setMustChangePassword(u.getMustChangePassword());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}

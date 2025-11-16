package app.ysp.service;

import app.ysp.domain.OneTimeLogin;
import app.ysp.domain.User;
import app.ysp.repo.OneTimeLoginRepository;
import app.ysp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class OneTimeLoginService {
    private final OneTimeLoginRepository otlRepo;
    private final UserRepository userRepo;
    private final MailService mailService;
    private final PasswordEncoder encoder;

    @Value("${app.public.base-url:http://localhost:3000}")
    private String publicBaseUrl;

    public OneTimeLoginService(OneTimeLoginRepository otlRepo, UserRepository userRepo, MailService mailService, PasswordEncoder encoder) {
        this.otlRepo = otlRepo;
        this.userRepo = userRepo;
        this.mailService = mailService;
        this.encoder = encoder;
    }

    public String createAndEmailToken(Long userId, long ttlSeconds) {
        User user = userRepo.findById(userId).orElseThrow();
        String raw = generateToken();
        String hash = sha256(raw);
        OneTimeLogin token = new OneTimeLogin();
        token.setUser(user);
        token.setTokenHash(hash);
        token.setExpiresAt(Instant.now().plusSeconds(ttlSeconds));
        otlRepo.save(token);

        String link = String.format("%s/update-password?token=%s", publicBaseUrl, urlSafe(raw));
        mailService.sendOneTimeLoginEmail(user.getEmail(), link);
        return raw;
    }

    public boolean updatePasswordByToken(String rawToken, String newPassword) {
        String hash = sha256(rawToken);
        Optional<OneTimeLogin> opt = otlRepo.findAll().stream()
                .filter(t -> t.getTokenHash().equals(hash) && t.getUsedAt() == null && t.getExpiresAt().isAfter(Instant.now()))
                .reduce((first, second) -> second);
        if (opt.isEmpty()) return false;
        OneTimeLogin t = opt.get();
        User u = t.getUser();
        u.setPasswordHash(encoder.encode(newPassword));
        u.setMustChangePassword(false);
        u.setLastPasswordChangeAt(Instant.now());
        userRepo.save(u);
        t.setUsedAt(Instant.now());
        otlRepo.save(t);
        return true;
    }

    private String generateToken() {
        byte[] bytes = new byte[24];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String urlSafe(String token) { return token; }

    private String sha256(String s) {
        try {
            var md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(s.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(dig);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

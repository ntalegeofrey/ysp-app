package app.ysp.service;

import app.ysp.domain.MfaCode;
import app.ysp.domain.User;
import app.ysp.dto.LoginRequest;
import app.ysp.repo.MfaCodeRepository;
import app.ysp.repo.UserRepository;
import app.ysp.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final MfaCodeRepository mfaCodeRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final MailService mailService;

    public AuthService(UserRepository userRepository, MfaCodeRepository mfaCodeRepository, PasswordEncoder encoder, JwtService jwtService, MailService mailService) {
        this.userRepository = userRepository;
        this.mfaCodeRepository = mfaCodeRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }

    public boolean handleLogin(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();
        if (!user.getEnabled()) return false;
        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) return false;
        // create/send MFA code
        String code = String.format("%05d", new Random().nextInt(100000));
        MfaCode mfa = new MfaCode();
        mfa.setUser(user);
        mfa.setCode(code);
        mfa.setExpiresAt(Instant.now().plusSeconds(600));
        mfa.setUsed(false);
        mfaCodeRepository.save(mfa);
        System.out.println("[DEV] MFA code for " + user.getEmail() + ": " + code);
        mailService.sendMfaCode(user.getEmail(), code);
        return true;
    }

    public String verifyMfa(String email, String code) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return null;
        User user = userOpt.get();
        var mfaOpt = mfaCodeRepository.findTopByUserAndCodeAndUsedFalseAndExpiresAtAfterOrderByIdDesc(user, code, Instant.now());
        if (mfaOpt.isEmpty()) return null;
        MfaCode mfa = mfaOpt.get();
        mfa.setUsed(true);
        mfaCodeRepository.save(mfa);
        var claims = new HashMap<String, Object>();
        claims.put("id", user.getId());
        claims.put("role", user.getRole());
        return jwtService.generateToken(user.getEmail(), claims);
    }

    public boolean resendMfa(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();
        if (!Boolean.TRUE.equals(user.getEnabled())) return false;
        String code = String.format("%05d", new Random().nextInt(100000));
        MfaCode mfa = new MfaCode();
        mfa.setUser(user);
        mfa.setCode(code);
        mfa.setExpiresAt(Instant.now().plusSeconds(600));
        mfa.setUsed(false);
        mfaCodeRepository.save(mfa);
        mailService.sendMfaCode(user.getEmail(), code);
        return true;
    }

    public void ensureAdminSeed(String email, String password) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPasswordHash(encoder.encode(password));
            u.setRole("admin");
            u.setEnabled(true);
            return userRepository.save(u);
        });
    }
}

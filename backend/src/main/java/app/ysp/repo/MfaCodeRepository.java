package app.ysp.repo;

import app.ysp.domain.MfaCode;
import app.ysp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface MfaCodeRepository extends JpaRepository<MfaCode, Long> {
    Optional<MfaCode> findTopByUserAndUsedFalseAndExpiresAtAfterOrderByIdDesc(User user, Instant now);
    Optional<MfaCode> findTopByUserAndCodeAndUsedFalseAndExpiresAtAfterOrderByIdDesc(User user, String code, Instant now);
}

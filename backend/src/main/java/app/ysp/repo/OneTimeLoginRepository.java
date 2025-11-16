package app.ysp.repo;

import app.ysp.domain.OneTimeLogin;
import app.ysp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface OneTimeLoginRepository extends JpaRepository<OneTimeLogin, Long> {
    Optional<OneTimeLogin> findTopByUserAndTokenHashAndUsedAtIsNullAndExpiresAtAfterOrderByIdDesc(User user, String tokenHash, Instant now);
}

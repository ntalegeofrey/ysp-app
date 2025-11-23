package app.ysp.repo;

import app.ysp.entity.ProgramUcrNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramUcrNotificationRepository extends JpaRepository<ProgramUcrNotification, Long> {
}

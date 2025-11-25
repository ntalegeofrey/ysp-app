package app.ysp.repo;

import app.ysp.entity.RepairIntervention;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairInterventionRepository extends JpaRepository<RepairIntervention, Long> {
    List<RepairIntervention> findByProgram_Id(Long programId);
    List<RepairIntervention> findByProgram_IdOrderByCreatedAtDesc(Long programId);
}

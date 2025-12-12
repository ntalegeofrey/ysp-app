package app.ysp.repository;

import app.ysp.entity.InventoryAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryAuditRepository extends JpaRepository<InventoryAudit, Long> {
    
    List<InventoryAudit> findByProgramIdOrderByAuditDateDesc(Long programId);
    
    Optional<InventoryAudit> findByProgramIdAndAuditDate(Long programId, LocalDate auditDate);
    
    boolean existsByProgramIdAndAuditDate(Long programId, LocalDate auditDate);
}

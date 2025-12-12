package app.ysp.repository;

import app.ysp.entity.InventoryAuditItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryAuditItemRepository extends JpaRepository<InventoryAuditItem, Long> {
    
    List<InventoryAuditItem> findByAuditId(Long auditId);
}

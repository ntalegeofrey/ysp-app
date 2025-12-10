package app.ysp.repo;

import app.ysp.entity.InventoryRequisition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRequisitionRepository extends JpaRepository<InventoryRequisition, Long> {
    List<InventoryRequisition> findByProgram_IdOrderByCreatedAtDesc(Long programId);
    List<InventoryRequisition> findByProgram_IdAndStatusOrderByCreatedAtDesc(Long programId, String status);
    Optional<InventoryRequisition> findByIdAndProgram_Id(Long id, Long programId);
    Long countByProgram_IdAndStatus(Long programId, String status);
    
    @Query("SELECT r FROM InventoryRequisition r WHERE r.program.id = :programId " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:category IS NULL OR r.category = :category) " +
           "AND (:priority IS NULL OR r.priority = :priority) " +
           "AND (:searchTerm IS NULL OR LOWER(r.itemName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(r.requisitionNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY r.createdAt DESC")
    Page<InventoryRequisition> filterRequisitions(
        @Param("programId") Long programId,
        @Param("status") String status,
        @Param("category") String category,
        @Param("priority") String priority,
        @Param("searchTerm") String searchTerm,
        Pageable pageable
    );
    
    @Query("SELECT CAST(SUBSTRING(r.requisitionNumber, LENGTH(r.requisitionNumber) - 2, 3) AS int) " +
           "FROM InventoryRequisition r WHERE r.requisitionNumber LIKE :pattern " +
           "ORDER BY r.requisitionNumber DESC LIMIT 1")
    Integer findMaxRequisitionNumberForYear(@Param("pattern") String pattern);
}

package app.ysp.repository;

import app.ysp.entity.InventoryRequisition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRequisitionRepository extends JpaRepository<InventoryRequisition, Long> {
    
    List<InventoryRequisition> findByProgramIdOrderByRequestDateDesc(Long programId);
    
    List<InventoryRequisition> findByProgramIdAndStatus(Long programId, String status);
    
    Optional<InventoryRequisition> findByRequisitionNumber(String requisitionNumber);
    
    Optional<InventoryRequisition> findByIdAndProgramId(Long id, Long programId);
    
    @Query("SELECT r FROM InventoryRequisition r WHERE r.program.id = :programId " +
           "AND (:status IS NULL OR r.status = :status) " +
           "AND (:category IS NULL OR r.category = :category) " +
           "AND (:priority IS NULL OR r.priority = :priority) " +
           "AND (:searchTerm IS NULL OR " +
           "LOWER(r.itemName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(r.requisitionNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(r.requestedByName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY r.requestDate DESC")
    Page<InventoryRequisition> filterRequisitions(@Param("programId") Long programId,
                                                   @Param("status") String status,
                                                   @Param("category") String category,
                                                   @Param("priority") String priority,
                                                   @Param("searchTerm") String searchTerm,
                                                   Pageable pageable);
    
    @Query("SELECT COUNT(r) FROM InventoryRequisition r WHERE r.program.id = :programId AND r.status = :status")
    Long countByProgramIdAndStatus(@Param("programId") Long programId, @Param("status") String status);
    
    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(r.requisitionNumber, 10) AS INTEGER)), 0) FROM InventoryRequisition r " +
           "WHERE r.requisitionNumber LIKE :pattern")
    Integer findMaxRequisitionNumberForYear(@Param("pattern") String pattern);
}

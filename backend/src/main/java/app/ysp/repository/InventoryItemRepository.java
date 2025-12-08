package app.ysp.repository;

import app.ysp.entity.InventoryItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    
    List<InventoryItem> findByProgramId(Long programId);
    
    List<InventoryItem> findByProgramIdAndCategory(Long programId, String category);
    
    List<InventoryItem> findByProgramIdAndStatus(Long programId, String status);
    
    Optional<InventoryItem> findByIdAndProgramId(Long id, Long programId);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.program.id = :programId " +
           "AND (:category IS NULL OR i.category = :category) " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:searchTerm IS NULL OR " +
           "LOWER(i.itemName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(i.location) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<InventoryItem> filterItems(@Param("programId") Long programId,
                                     @Param("category") String category,
                                     @Param("status") String status,
                                     @Param("searchTerm") String searchTerm,
                                     Pageable pageable);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.program.id = :programId " +
           "AND i.currentQuantity < i.minimumQuantity")
    List<InventoryItem> findLowStockItems(@Param("programId") Long programId);
    
    @Query("SELECT i FROM InventoryItem i WHERE i.program.id = :programId " +
           "AND i.currentQuantity <= (i.minimumQuantity * 0.5)")
    List<InventoryItem> findCriticalStockItems(@Param("programId") Long programId);
    
    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.program.id = :programId")
    Long countByProgramId(@Param("programId") Long programId);
    
    @Query("SELECT COUNT(i) FROM InventoryItem i WHERE i.program.id = :programId AND i.status = :status")
    Long countByProgramIdAndStatus(@Param("programId") Long programId, @Param("status") String status);
}

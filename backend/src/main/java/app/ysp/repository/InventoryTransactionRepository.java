package app.ysp.repository;

import app.ysp.entity.InventoryTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    
    List<InventoryTransaction> findByProgramIdOrderByTransactionDateDesc(Long programId);
    
    List<InventoryTransaction> findByInventoryItemIdOrderByTransactionDateDesc(Long inventoryItemId);
    
    @Query("SELECT t FROM InventoryTransaction t WHERE t.program.id = :programId " +
           "AND (:transactionType IS NULL OR t.transactionType = :transactionType) " +
           "AND (:category IS NULL OR t.inventoryItem.category = :category) " +
           "AND (:searchTerm IS NULL OR " +
           "LOWER(t.inventoryItem.itemName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.staffName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY t.transactionDate DESC")
    Page<InventoryTransaction> filterTransactions(@Param("programId") Long programId,
                                                   @Param("transactionType") String transactionType,
                                                   @Param("category") String category,
                                                   @Param("searchTerm") String searchTerm,
                                                   Pageable pageable);
    
    @Query("SELECT t FROM InventoryTransaction t WHERE t.program.id = :programId " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "ORDER BY t.transactionDate DESC")
    List<InventoryTransaction> findByDateRange(@Param("programId") Long programId,
                                                @Param("startDate") Instant startDate,
                                                @Param("endDate") Instant endDate);
}

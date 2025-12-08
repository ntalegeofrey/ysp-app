package app.ysp.repository;

import app.ysp.entity.OffsiteMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OffsiteMovementRepository extends JpaRepository<OffsiteMovement, Long> {
    
    // Find all movements for a program
    Page<OffsiteMovement> findByProgram_IdOrderByMovementDateDescMovementTimeDesc(Long programId, Pageable pageable);
    
    // Find movements by status
    List<OffsiteMovement> findByProgram_IdAndStatusOrderByMovementDateAscMovementTimeAsc(Long programId, String status);
    
    // Find movements for a specific resident
    Page<OffsiteMovement> findByResident_IdOrderByMovementDateDescMovementTimeDesc(Long residentId, Pageable pageable);
    
    // Find movements by date range
    List<OffsiteMovement> findByProgram_IdAndMovementDateBetweenOrderByMovementDateDescMovementTimeDesc(
        Long programId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find urgent/emergency movements
    List<OffsiteMovement> findByProgram_IdAndPriorityLevelInAndStatusOrderByMovementDateAscMovementTimeAsc(
        Long programId,
        List<String> priorityLevels,
        String status
    );
    
    // Find today's movements
    @Query("SELECT m FROM OffsiteMovement m " +
           "WHERE m.program.id = :programId " +
           "AND m.movementDate = :date " +
           "AND m.status IN ('SCHEDULED', 'IN_PROGRESS') " +
           "ORDER BY m.movementTime ASC")
    List<OffsiteMovement> findTodaysMovements(@Param("programId") Long programId, @Param("date") LocalDate date);
    
    // Complex filter for archive with pagination
    @Query("SELECT m FROM OffsiteMovement m " +
           "WHERE m.program.id = :programId " +
           "AND (:residentId IS NULL OR m.resident.id = :residentId) " +
           "AND (:status IS NULL OR m.status = :status) " +
           "AND (:movementType IS NULL OR m.movementType = :movementType) " +
           "AND (CAST(:startDate AS date) IS NULL OR m.movementDate >= :startDate) " +
           "AND (CAST(:endDate AS date) IS NULL OR m.movementDate <= :endDate) " +
           "ORDER BY m.movementDate DESC, m.movementTime DESC")
    Page<OffsiteMovement> filterMovements(
        @Param("programId") Long programId,
        @Param("residentId") Long residentId,
        @Param("status") String status,
        @Param("movementType") String movementType,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    // Count movements by status
    long countByProgram_IdAndStatus(Long programId, String status);
    
    // Count urgent movements
    @Query("SELECT COUNT(m) FROM OffsiteMovement m " +
           "WHERE m.program.id = :programId " +
           "AND m.priorityLevel IN ('URGENT', 'EMERGENCY') " +
           "AND m.status = 'SCHEDULED'")
    long countUrgentMovements(@Param("programId") Long programId);
}

package app.ysp.repository;

import app.ysp.entity.RepairIntervention;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RepairInterventionRepository extends JpaRepository<RepairIntervention, Long> {
    
    // Find all repairs for a program, ordered by date descending
    Page<RepairIntervention> findByProgram_IdOrderByInfractionDateDescCreatedAtDesc(Long programId, Pageable pageable);
    
    // Find all repairs for a specific resident
    List<RepairIntervention> findByResident_IdOrderByInfractionDateDesc(Long residentId);
    
    // Find all repairs for a resident in a program
    List<RepairIntervention> findByProgram_IdAndResident_IdOrderByInfractionDateDesc(Long programId, Long residentId);
    
    // Find by program and status
    List<RepairIntervention> findByProgram_IdAndStatusOrderByInfractionDateDesc(Long programId, String status);
    
    // Find by program and repair level
    List<RepairIntervention> findByProgram_IdAndRepairLevelOrderByInfractionDateDesc(Long programId, String repairLevel);
    
    // Find by date range
    List<RepairIntervention> findByProgram_IdAndInfractionDateBetweenOrderByInfractionDateDesc(
        Long programId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find active repairs for a resident (pending or approved)
    @Query("SELECT ri FROM RepairIntervention ri WHERE ri.resident.id = :residentId " +
           "AND ri.status IN ('pending_review', 'approved') " +
           "AND (ri.repairEndDate IS NULL OR ri.repairEndDate >= CURRENT_DATE) " +
           "ORDER BY ri.infractionDate DESC")
    List<RepairIntervention> findActiveRepairsByResident(@Param("residentId") Long residentId);
    
    // Find repairs pending review
    @Query("SELECT ri FROM RepairIntervention ri WHERE ri.program.id = :programId " +
           "AND (ri.pdReviewStatus = 'pending' OR ri.clinicalReviewStatus = 'pending') " +
           "ORDER BY ri.infractionDate DESC")
    List<RepairIntervention> findPendingReviewsByProgram(@Param("programId") Long programId);
    
    // Search repairs by infraction behavior or comments
    @Query("SELECT ri FROM RepairIntervention ri WHERE ri.program.id = :programId " +
           "AND (ri.infractionBehavior LIKE %:search% OR ri.comments LIKE %:search% " +
           "OR ri.assigningStaffName LIKE %:search%) " +
           "ORDER BY ri.infractionDate DESC")
    List<RepairIntervention> searchByProgramAndText(
        @Param("programId") Long programId,
        @Param("search") String search
    );
    
    // Count repairs for a program
    long countByProgram_Id(Long programId);
    
    // Count repairs for a resident
    long countByResident_Id(Long residentId);
    
    // Count active repairs for a program
    @Query("SELECT COUNT(ri) FROM RepairIntervention ri WHERE ri.program.id = :programId " +
           "AND ri.status IN ('pending_review', 'approved') " +
           "AND (ri.repairEndDate IS NULL OR ri.repairEndDate >= CURRENT_DATE)")
    long countActiveRepairsByProgram(@Param("programId") Long programId);
}

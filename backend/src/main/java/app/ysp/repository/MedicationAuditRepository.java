package app.ysp.repository;

import app.ysp.entity.MedicationAudit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicationAuditRepository extends JpaRepository<MedicationAudit, Long> {
    
    // Find all audits for a program
    List<MedicationAudit> findByProgram_IdOrderByAuditDateDescAuditTimeDesc(Long programId);
    
    // Find audits by program with pagination
    Page<MedicationAudit> findByProgram_IdOrderByAuditDateDescAuditTimeDesc(Long programId, Pageable pageable);
    
    // Find pending audits for a program
    @Query("SELECT ma FROM MedicationAudit ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.status = 'PENDING' " +
           "ORDER BY ma.auditDate DESC, ma.auditTime DESC")
    List<MedicationAudit> findPendingByProgram(@Param("programId") Long programId);
    
    // Find audits by status
    List<MedicationAudit> findByProgram_IdAndStatusOrderByAuditDateDesc(Long programId, String status);
    
    // Find audits by shift
    List<MedicationAudit> findByProgram_IdAndShiftOrderByAuditDateDesc(Long programId, String shift);
    
    // Find audits with discrepancies
    @Query("SELECT ma FROM MedicationAudit ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.hasDiscrepancies = true " +
           "AND ma.status = 'APPROVED' " +
           "ORDER BY ma.auditDate DESC")
    List<MedicationAudit> findAuditsWithDiscrepancies(@Param("programId") Long programId);
    
    // Find audits by date range
    List<MedicationAudit> findByProgram_IdAndAuditDateBetweenOrderByAuditDateDesc(
        Long programId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find audits submitted by a staff member
    @Query("SELECT ma FROM MedicationAudit ma " +
           "WHERE ma.submittedByStaff.id = :staffId " +
           "ORDER BY ma.auditDate DESC")
    List<MedicationAudit> findBySubmittedByStaff(@Param("staffId") Long staffId);
    
    // Complex filter for archive
    @Query("SELECT ma FROM MedicationAudit ma " +
           "WHERE ma.program.id = :programId " +
           "AND (:status IS NULL OR ma.status = :status) " +
           "AND (:shift IS NULL OR ma.shift = :shift) " +
           "AND (:startDate IS NULL OR ma.auditDate >= :startDate) " +
           "AND (:endDate IS NULL OR ma.auditDate <= :endDate) " +
           "AND (:hasDiscrepancies IS NULL OR ma.hasDiscrepancies = :hasDiscrepancies) " +
           "ORDER BY ma.auditDate DESC, ma.auditTime DESC")
    Page<MedicationAudit> filterAudits(
        @Param("programId") Long programId,
        @Param("status") String status,
        @Param("shift") String shift,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("hasDiscrepancies") Boolean hasDiscrepancies,
        Pageable pageable
    );
    
    // Count pending approvals
    long countByProgram_IdAndStatus(Long programId, String status);
    
    // Count audits for a specific date and shift
    @Query("SELECT COUNT(ma) FROM MedicationAudit ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.auditDate = :date " +
           "AND ma.shift = :shift")
    long countByDateAndShift(@Param("programId") Long programId, @Param("date") LocalDate date, @Param("shift") String shift);
}

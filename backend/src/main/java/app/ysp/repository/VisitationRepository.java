package app.ysp.repository;

import app.ysp.entity.Visitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VisitationRepository extends JpaRepository<Visitation, Long> {
    
    // Find all visitations for a program, ordered by date descending
    Page<Visitation> findByProgram_IdOrderByScheduledDateDescScheduledStartTimeDesc(Long programId, Pageable pageable);
    
    // Find all visitations for a specific resident
    List<Visitation> findByResident_IdOrderByScheduledDateDesc(Long residentId);
    
    // Find all visitations for a resident in a program
    List<Visitation> findByProgram_IdAndResident_IdOrderByScheduledDateDesc(Long programId, Long residentId);
    
    // Find by program and status
    List<Visitation> findByProgram_IdAndStatusOrderByScheduledDateDesc(Long programId, String status);
    
    // Find by program and approval status
    List<Visitation> findByProgram_IdAndApprovalStatusOrderByScheduledDateDesc(Long programId, String approvalStatus);
    
    // Find by program and visit type
    List<Visitation> findByProgram_IdAndVisitTypeOrderByScheduledDateDesc(Long programId, String visitType);
    
    // Find today's visitations for a program
    @Query("SELECT v FROM Visitation v WHERE v.program.id = :programId " +
           "AND v.scheduledDate = :date " +
           "AND v.approvalStatus = 'APPROVED' " +
           "ORDER BY v.scheduledStartTime ASC")
    List<Visitation> findTodaysVisitationsByProgram(@Param("programId") Long programId, @Param("date") LocalDate date);
    
    // Find upcoming approved visitations
    @Query("SELECT v FROM Visitation v WHERE v.program.id = :programId " +
           "AND v.scheduledDate >= :startDate " +
           "AND v.approvalStatus = 'APPROVED' " +
           "AND v.status = 'SCHEDULED' " +
           "ORDER BY v.scheduledDate ASC, v.scheduledStartTime ASC")
    List<Visitation> findUpcomingVisitations(@Param("programId") Long programId, @Param("startDate") LocalDate startDate);
    
    // Find visitations by date range
    List<Visitation> findByProgram_IdAndScheduledDateBetweenOrderByScheduledDateDesc(
        Long programId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find pending approval visitations
    @Query("SELECT v FROM Visitation v WHERE v.program.id = :programId " +
           "AND v.approvalStatus = 'PENDING' " +
           "ORDER BY v.scheduledDate ASC, v.scheduledStartTime ASC")
    List<Visitation> findPendingApprovalByProgram(@Param("programId") Long programId);
    
    // Find visitations with incidents
    @Query("SELECT v FROM Visitation v WHERE v.program.id = :programId " +
           "AND v.incidentOccurred = true " +
           "ORDER BY v.scheduledDate DESC")
    List<Visitation> findVisitationsWithIncidents(@Param("programId") Long programId);
    
    // Search visitations
    @Query("SELECT v FROM Visitation v " +
           "JOIN v.resident r " +
           "WHERE v.program.id = :programId " +
           "AND (LOWER(r.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.visitationRoom) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(v.visitorInfoJson) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY v.scheduledDate DESC")
    List<Visitation> searchVisitations(@Param("programId") Long programId, @Param("search") String search);
    
    // Complex filter query for archive
    @Query("SELECT v FROM Visitation v " +
           "JOIN v.resident r " +
           "WHERE v.program.id = :programId " +
           "AND (:residentId IS NULL OR v.resident.id = :residentId) " +
           "AND (:visitType IS NULL OR v.visitType = :visitType) " +
           "AND (:status IS NULL OR v.status = :status) " +
           "AND (:approvalStatus IS NULL OR v.approvalStatus = :approvalStatus) " +
           "AND (:startDate IS NULL OR v.scheduledDate >= :startDate) " +
           "AND (:endDate IS NULL OR v.scheduledDate <= :endDate) " +
           "ORDER BY v.scheduledDate DESC, v.scheduledStartTime DESC")
    Page<Visitation> filterVisitations(
        @Param("programId") Long programId,
        @Param("residentId") Long residentId,
        @Param("visitType") String visitType,
        @Param("status") String status,
        @Param("approvalStatus") String approvalStatus,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    // Count visitations for a program
    long countByProgram_Id(Long programId);
    
    // Count visitations for a resident
    long countByResident_Id(Long residentId);
    
    // Count pending approvals
    long countByProgram_IdAndApprovalStatus(Long programId, String approvalStatus);
    
    // Count today's visitations
    @Query("SELECT COUNT(v) FROM Visitation v WHERE v.program.id = :programId " +
           "AND v.scheduledDate = :date " +
           "AND v.approvalStatus = 'APPROVED'")
    long countTodaysVisitations(@Param("programId") Long programId, @Param("date") LocalDate date);
}

package app.ysp.repository;

import app.ysp.entity.PointsRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PointsRedemptionRepository extends JpaRepository<PointsRedemption, Long> {
    
    // Find all redemptions for a resident
    List<PointsRedemption> findByResident_IdOrderByRedemptionDateDesc(Long residentId);
    
    // Find all redemptions for a program
    List<PointsRedemption> findByProgram_IdOrderByRedemptionDateDesc(Long programId);
    
    // Find redemptions for a specific diary card
    List<PointsRedemption> findByDiaryCard_IdOrderByRedemptionDateDesc(Long diaryCardId);
    
    // Find redemptions by approval status
    List<PointsRedemption> findByProgram_IdAndApprovalStatusOrderByRedemptionDateDesc(
        Long programId,
        String approvalStatus
    );
    
    // Find redemptions in a date range
    List<PointsRedemption> findByResident_IdAndRedemptionDateBetweenOrderByRedemptionDateDesc(
        Long residentId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find pending redemptions for a program
    @Query("SELECT pr FROM PointsRedemption pr WHERE pr.program.id = :programId " +
           "AND pr.approvalStatus = 'pending' " +
           "ORDER BY pr.redemptionDate DESC")
    List<PointsRedemption> findPendingRedemptionsByProgram(@Param("programId") Long programId);
    
    // Calculate total points redeemed by a resident
    @Query("SELECT COALESCE(SUM(pr.pointsRedeemed), 0) FROM PointsRedemption pr " +
           "WHERE pr.resident.id = :residentId AND pr.approvalStatus = 'approved'")
    Integer getTotalPointsRedeemedByResident(@Param("residentId") Long residentId);
    
    // Calculate total points redeemed by a resident in a date range
    @Query("SELECT COALESCE(SUM(pr.pointsRedeemed), 0) FROM PointsRedemption pr " +
           "WHERE pr.resident.id = :residentId " +
           "AND pr.approvalStatus = 'approved' " +
           "AND pr.redemptionDate BETWEEN :startDate AND :endDate")
    Integer getTotalPointsRedeemedByResidentInPeriod(
        @Param("residentId") Long residentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Count redemptions for a resident
    long countByResident_Id(Long residentId);
    
    // Count pending redemptions for a program
    long countByProgram_IdAndApprovalStatus(Long programId, String approvalStatus);
}

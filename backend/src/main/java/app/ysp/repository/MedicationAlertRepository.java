package app.ysp.repository;

import app.ysp.entity.MedicationAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface MedicationAlertRepository extends JpaRepository<MedicationAlert, Long> {
    
    // Find all alerts for a program
    List<MedicationAlert> findByProgram_IdOrderByCreatedAtDesc(Long programId);
    
    // Find active alerts for a program
    List<MedicationAlert> findByProgram_IdAndStatusOrderByCreatedAtDesc(Long programId, String status);
    
    // Find alerts by type
    List<MedicationAlert> findByProgram_IdAndAlertTypeOrderByCreatedAtDesc(Long programId, String alertType);
    
    // Find active alerts by type
    @Query("SELECT ma FROM MedicationAlert ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.status = 'ACTIVE' " +
           "AND ma.alertType = :alertType " +
           "ORDER BY ma.createdAt DESC")
    List<MedicationAlert> findActiveAlertsByType(@Param("programId") Long programId, @Param("alertType") String alertType);
    
    // Find alerts for a specific resident
    List<MedicationAlert> findByResident_IdOrderByCreatedAtDesc(Long residentId);
    
    // Find active alerts for a resident
    @Query("SELECT ma FROM MedicationAlert ma " +
           "WHERE ma.resident.id = :residentId " +
           "AND ma.status = 'ACTIVE' " +
           "ORDER BY ma.createdAt DESC")
    List<MedicationAlert> findActiveAlertsByResident(@Param("residentId") Long residentId);
    
    // Find alerts for a specific medication
    List<MedicationAlert> findByResidentMedication_IdOrderByCreatedAtDesc(Long residentMedicationId);
    
    // Find critical alerts
    @Query("SELECT ma FROM MedicationAlert ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.status = 'ACTIVE' " +
           "AND ma.alertType = 'CRITICAL' " +
           "ORDER BY ma.createdAt DESC")
    List<MedicationAlert> findCriticalAlerts(@Param("programId") Long programId);
    
    // Find recent alerts (last N hours)
    @Query("SELECT ma FROM MedicationAlert ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.status = 'ACTIVE' " +
           "AND ma.createdAt >= :since " +
           "ORDER BY ma.createdAt DESC")
    List<MedicationAlert> findRecentAlerts(@Param("programId") Long programId, @Param("since") Instant since);
    
    // Count active alerts by type
    long countByProgram_IdAndStatusAndAlertType(Long programId, String status, String alertType);
    
    // Count all active alerts
    long countByProgram_IdAndStatus(Long programId, String status);
    
    // Count unresolved alerts for a resident
    @Query("SELECT COUNT(ma) FROM MedicationAlert ma " +
           "WHERE ma.resident.id = :residentId " +
           "AND ma.status = 'ACTIVE'")
    long countActiveAlertsByResident(@Param("residentId") Long residentId);
}

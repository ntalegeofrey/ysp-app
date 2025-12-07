package app.ysp.repository;

import app.ysp.entity.MedicationAuditCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicationAuditCountRepository extends JpaRepository<MedicationAuditCount, Long> {
    
    // Find all counts for a specific audit
    List<MedicationAuditCount> findByAudit_Id(Long auditId);
    
    // Find counts for a specific resident across audits
    List<MedicationAuditCount> findByResident_IdOrderByCreatedAtDesc(Long residentId);
    
    // Find counts for a specific medication
    List<MedicationAuditCount> findByResidentMedication_IdOrderByCreatedAtDesc(Long residentMedicationId);
    
    // Find counts with variance (discrepancies)
    @Query("SELECT mac FROM MedicationAuditCount mac " +
           "WHERE mac.audit.id = :auditId " +
           "AND mac.variance != 0 " +
           "ORDER BY ABS(mac.variance) DESC")
    List<MedicationAuditCount> findDiscrepanciesByAudit(@Param("auditId") Long auditId);
    
    // Find all discrepancies for a resident medication
    @Query("SELECT mac FROM MedicationAuditCount mac " +
           "WHERE mac.residentMedication.id = :medicationId " +
           "AND mac.variance != 0 " +
           "ORDER BY mac.createdAt DESC")
    List<MedicationAuditCount> findDiscrepanciesByMedication(@Param("medicationId") Long medicationId);
    
    // Get latest count for a medication
    @Query("SELECT mac FROM MedicationAuditCount mac " +
           "WHERE mac.residentMedication.id = :medicationId " +
           "AND mac.audit.status = 'APPROVED' " +
           "ORDER BY mac.createdAt DESC " +
           "LIMIT 1")
    MedicationAuditCount findLatestApprovedCount(@Param("medicationId") Long medicationId);
    
    // Count total discrepancies in an audit
    @Query("SELECT COUNT(mac) FROM MedicationAuditCount mac " +
           "WHERE mac.audit.id = :auditId " +
           "AND mac.variance != 0")
    long countDiscrepanciesByAudit(@Param("auditId") Long auditId);
}

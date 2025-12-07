package app.ysp.repository;

import app.ysp.entity.ResidentMedication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResidentMedicationRepository extends JpaRepository<ResidentMedication, Long> {
    
    // Find all medications for a resident
    List<ResidentMedication> findByResident_IdOrderByCreatedAtDesc(Long residentId);
    
    // Find active medications for a resident
    List<ResidentMedication> findByResident_IdAndStatusOrderByCreatedAtDesc(Long residentId, String status);
    
    // Find all medications for a program
    List<ResidentMedication> findByProgram_IdOrderByCreatedAtDesc(Long programId);
    
    // Find active medications for a program
    List<ResidentMedication> findByProgram_IdAndStatusOrderByCreatedAtDesc(Long programId, String status);
    
    // Find medications by resident and status
    @Query("SELECT rm FROM ResidentMedication rm " +
           "WHERE rm.resident.id = :residentId " +
           "AND rm.status = :status " +
           "ORDER BY rm.medicationName ASC")
    List<ResidentMedication> findActiveByResident(@Param("residentId") Long residentId, @Param("status") String status);
    
    // Find medications with low inventory
    @Query("SELECT rm FROM ResidentMedication rm " +
           "WHERE rm.program.id = :programId " +
           "AND rm.status = 'ACTIVE' " +
           "AND rm.currentCount <= :threshold " +
           "ORDER BY rm.currentCount ASC")
    List<ResidentMedication> findLowInventory(@Param("programId") Long programId, @Param("threshold") Integer threshold);
    
    // Search medications by name
    @Query("SELECT rm FROM ResidentMedication rm " +
           "WHERE rm.program.id = :programId " +
           "AND LOWER(rm.medicationName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "ORDER BY rm.medicationName ASC")
    List<ResidentMedication> searchByMedicationName(@Param("programId") Long programId, @Param("search") String search);
    
    // Count medications for a resident
    long countByResident_IdAndStatus(Long residentId, String status);
    
    // Count all active medications in a program
    long countByProgram_IdAndStatus(Long programId, String status);
}

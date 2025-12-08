package app.ysp.repository;

import app.ysp.entity.MedicationAdministration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicationAdministrationRepository extends JpaRepository<MedicationAdministration, Long> {
    
    // Find all administrations for a resident
    List<MedicationAdministration> findByResident_IdOrderByAdministrationDateDescAdministrationTimeDesc(Long residentId);
    
    // Find administrations for a resident with pagination
    Page<MedicationAdministration> findByResident_IdOrderByAdministrationDateDescAdministrationTimeDesc(Long residentId, Pageable pageable);
    
    // Find administrations for a program
    Page<MedicationAdministration> findByProgram_IdOrderByAdministrationDateDescAdministrationTimeDesc(Long programId, Pageable pageable);
    
    // Find administrations by date range
    List<MedicationAdministration> findByProgram_IdAndAdministrationDateBetweenOrderByAdministrationDateDescAdministrationTimeDesc(
        Long programId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find administrations for a specific date and shift
    @Query("SELECT ma FROM MedicationAdministration ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.administrationDate = :date " +
           "AND ma.shift = :shift " +
           "ORDER BY ma.administrationTime ASC")
    List<MedicationAdministration> findByDateAndShift(
        @Param("programId") Long programId,
        @Param("date") LocalDate date,
        @Param("shift") String shift
    );
    
    // Find administrations by action (REFUSED, MISSED, etc.)
    @Query("SELECT ma FROM MedicationAdministration ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.action = :action " +
           "AND ma.administrationDate >= :startDate " +
           "ORDER BY ma.administrationDate DESC")
    List<MedicationAdministration> findByAction(
        @Param("programId") Long programId,
        @Param("action") String action,
        @Param("startDate") LocalDate startDate
    );
    
    // Find late administrations
    @Query("SELECT ma FROM MedicationAdministration ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.wasLate = true " +
           "AND ma.administrationDate >= :startDate " +
           "ORDER BY ma.administrationDate DESC")
    List<MedicationAdministration> findLateAdministrations(
        @Param("programId") Long programId,
        @Param("startDate") LocalDate startDate
    );
    
    // Complex filter for archive
    @Query("SELECT ma FROM MedicationAdministration ma " +
           "WHERE ma.program.id = :programId " +
           "AND (:residentId IS NULL OR ma.resident.id = :residentId) " +
           "AND (:shift IS NULL OR ma.shift = :shift) " +
           "AND (:action IS NULL OR ma.action = :action) " +
           "AND (CAST(:startDate AS date) IS NULL OR ma.administrationDate >= :startDate) " +
           "AND (CAST(:endDate AS date) IS NULL OR ma.administrationDate <= :endDate) " +
           "ORDER BY ma.administrationDate DESC, ma.administrationTime DESC")
    Page<MedicationAdministration> filterAdministrations(
        @Param("programId") Long programId,
        @Param("residentId") Long residentId,
        @Param("shift") String shift,
        @Param("action") String action,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    // Count administrations for today by shift
    @Query("SELECT COUNT(ma) FROM MedicationAdministration ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.administrationDate = :date " +
           "AND ma.shift = :shift")
    long countTodayByShift(@Param("programId") Long programId, @Param("date") LocalDate date, @Param("shift") String shift);
    
    // Count refused medications in date range
    @Query("SELECT COUNT(ma) FROM MedicationAdministration ma " +
           "WHERE ma.program.id = :programId " +
           "AND ma.action = 'REFUSED' " +
           "AND ma.administrationDate BETWEEN :startDate AND :endDate")
    long countRefusedInDateRange(@Param("programId") Long programId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}

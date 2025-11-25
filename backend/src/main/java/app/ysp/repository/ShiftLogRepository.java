package app.ysp.repository;

import app.ysp.entity.ShiftLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftLogRepository extends JpaRepository<ShiftLog, Long> {
    
    // Find all shift logs for a program, ordered by date descending
    Page<ShiftLog> findByProgram_IdOrderByShiftDateDescCreatedAtDesc(Long programId, Pageable pageable);
    
    // Find by program and date range
    List<ShiftLog> findByProgram_IdAndShiftDateBetween(
        Long programId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Find by program and shift type
    List<ShiftLog> findByProgram_IdAndShiftType(Long programId, String shiftType);
    
    // Find by program and overall status
    List<ShiftLog> findByProgram_IdAndOverallStatus(Long programId, String status);
    
    // Find specific shift log by program, date, and shift type
    Optional<ShiftLog> findByProgram_IdAndShiftDateAndShiftType(
        Long programId,
        LocalDate shiftDate,
        String shiftType
    );
    
    // Search shift logs by text in summary or supervisor
    @Query("SELECT sl FROM ShiftLog sl WHERE sl.program.id = :programId " +
           "AND (sl.shiftSummary LIKE %:search% OR sl.unitSupervisor LIKE %:search% " +
           "OR sl.incidentsEvents LIKE %:search%)")
    List<ShiftLog> searchByProgramAndText(
        @Param("programId") Long programId,
        @Param("search") String search
    );
    
    // Count logs for a program
    long countByProgram_Id(Long programId);
}

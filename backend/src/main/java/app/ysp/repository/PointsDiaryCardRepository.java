package app.ysp.repository;

import app.ysp.entity.PointsDiaryCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PointsDiaryCardRepository extends JpaRepository<PointsDiaryCard, Long> {
    
    // Find diary card for a resident and specific week
    Optional<PointsDiaryCard> findByResident_IdAndWeekStartDate(Long residentId, LocalDate weekStartDate);
    
    // Find all diary cards for a resident
    List<PointsDiaryCard> findByResident_IdOrderByWeekStartDateDesc(Long residentId);
    
    // Find all diary cards for a program
    List<PointsDiaryCard> findByProgram_IdOrderByWeekStartDateDesc(Long programId);
    
    // Find active diary cards (current week)
    @Query("SELECT pdc FROM PointsDiaryCard pdc WHERE pdc.program.id = :programId " +
           "AND pdc.status = 'active' " +
           "AND pdc.weekStartDate <= CURRENT_DATE AND pdc.weekEndDate >= CURRENT_DATE " +
           "ORDER BY pdc.weekStartDate DESC")
    List<PointsDiaryCard> findActiveDiaryCardsByProgram(@Param("programId") Long programId);
    
    // Find diary cards for a resident in a date range
    List<PointsDiaryCard> findByResident_IdAndWeekStartDateBetweenOrderByWeekStartDateDesc(
        Long residentId,
        LocalDate startDate,
        LocalDate endDate
    );
    
    // Get most recent diary card for a resident
    Optional<PointsDiaryCard> findFirstByResident_IdOrderByWeekStartDateDesc(Long residentId);
    
    // Count diary cards for a resident
    long countByResident_Id(Long residentId);
}

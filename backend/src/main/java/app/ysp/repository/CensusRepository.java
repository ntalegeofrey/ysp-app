package app.ysp.repository;

import app.ysp.entity.Census;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CensusRepository extends JpaRepository<Census, Long> {
    List<Census> findByProgramIdOrderByCensusDateDescCreatedAtDesc(Long programId);
    
    Optional<Census> findByProgramIdAndCensusDateAndShift(Long programId, LocalDate censusDate, String shift);
    
    boolean existsByProgramIdAndCensusDateAndShift(Long programId, LocalDate censusDate, String shift);
    
    List<Census> findByProgramIdAndCensusDateBetween(Long programId, LocalDate startDate, LocalDate endDate);
}

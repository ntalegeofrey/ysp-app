package app.ysp.repository;

import app.ysp.entity.Census;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CensusRepository extends JpaRepository<Census, Long> {
    List<Census> findByProgram_IdOrderByCensusDateDescCreatedAtDesc(Long programId);

    Optional<Census> findByProgram_IdAndCensusDateAndShift(Long programId, LocalDate censusDate, String shift);

    boolean existsByProgram_IdAndCensusDateAndShift(Long programId, LocalDate censusDate, String shift);

    List<Census> findByProgram_IdAndCensusDateBetween(Long programId, LocalDate startDate, LocalDate endDate);
}

package app.ysp.repository;

import app.ysp.entity.CensusEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CensusEntryRepository extends JpaRepository<CensusEntry, Long> {
    List<CensusEntry> findByCensusId(Long censusId);
}

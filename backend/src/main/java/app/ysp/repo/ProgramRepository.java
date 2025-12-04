package app.ysp.repo;

import app.ysp.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByActiveTrue();
    
    @Query("SELECT p.id FROM Program p WHERE p.region = :regionName")
    List<Long> findProgramIdsByRegion(@Param("regionName") String regionName);
}

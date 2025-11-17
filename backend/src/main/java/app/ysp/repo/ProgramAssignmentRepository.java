package app.ysp.repo;

import app.ysp.entity.ProgramAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramAssignmentRepository extends JpaRepository<ProgramAssignment, Long> {
    List<ProgramAssignment> findByProgram_Id(Long programId);
    List<ProgramAssignment> findByUserId(Long userId);
    List<ProgramAssignment> findByUserEmailIgnoreCase(String userEmail);

    @Query("select distinct pa.program.id from ProgramAssignment pa where lower(pa.userEmail) = lower(:email)")
    List<Long> findProgramIdsByUserEmail(@Param("email") String email);
}

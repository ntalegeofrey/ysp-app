package app.ysp.repo;

import app.ysp.entity.FirePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface FirePlanRepository extends JpaRepository<FirePlan, Long> {
    
    @Query("select f from FirePlan f where f.program.id = :programId and f.status = 'Active' order by f.generatedDate desc, f.id desc")
    Optional<FirePlan> findActivePlan(@Param("programId") Long programId);

    @Query("select f from FirePlan f where f.program.id = :programId order by f.generatedDate desc, f.id desc")
    List<FirePlan> findByProgramId(@Param("programId") Long programId);

    @Query("select f from FirePlan f where f.id = :id and f.program.id = :programId")
    Optional<FirePlan> findByIdAndProgramId(@Param("id") Long id, @Param("programId") Long programId);
}

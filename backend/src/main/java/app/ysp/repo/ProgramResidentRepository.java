package app.ysp.repo;

import app.ysp.entity.ProgramResident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramResidentRepository extends JpaRepository<ProgramResident, Long> {
    List<ProgramResident> findByProgram_Id(Long programId);
}

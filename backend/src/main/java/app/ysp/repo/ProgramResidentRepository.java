package app.ysp.repo;

import app.ysp.entity.ProgramResident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramResidentRepository extends JpaRepository<ProgramResident, Long> {
    List<ProgramResident> findByProgram_Id(Long programId);

    @Query(value = "SELECT max(resident_id::int) FROM program_residents WHERE program_id = :programId AND resident_id ~ '^[0-9]+'", nativeQuery = true)
    Integer findMaxNumericResidentForProgram(@Param("programId") Long programId);
}

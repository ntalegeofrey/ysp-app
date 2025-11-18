package app.ysp.repo;

import app.ysp.entity.ProgramUcrReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProgramUcrReportRepository extends JpaRepository<ProgramUcrReport, Long> {
    @Query("select r from ProgramUcrReport r where r.program.id = :programId order by r.reportDate desc, r.id desc")
    List<ProgramUcrReport> findAllByProgramOrder(@Param("programId") Long programId);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId")
    long countByProgramId(@Param("programId") Long programId);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId and lower(coalesce(r.status,'')) = 'critical'")
    long countCritical(@Param("programId") Long programId);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId and lower(coalesce(r.status,'')) like 'pending%'")
    long countPending(@Param("programId") Long programId);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId and r.reportDate between :start and :end")
    long countInRange(@Param("programId") Long programId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}

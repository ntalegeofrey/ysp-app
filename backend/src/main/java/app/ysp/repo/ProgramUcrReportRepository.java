package app.ysp.repo;

import app.ysp.entity.ProgramUcrReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @Query("select r from ProgramUcrReport r where r.program.id = :programId and (:q is null or lower(coalesce(r.additionalComments,'')) like concat('%', lower(:q), '%')) and (:date is null or r.reportDate = :date) order by r.reportDate desc, r.id desc")
    Page<ProgramUcrReport> findByFilters(@Param("programId") Long programId, @Param("q") String q, @Param("date") LocalDate date, Pageable pageable);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId")
    long countByProgramId(@Param("programId") Long programId);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId and r.reportDate between :start and :end")
    long countInRange(@Param("programId") Long programId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("select r from ProgramUcrReport r where r.id = :id and r.program.id = :programId")
    ProgramUcrReport findOneByIdAndProgram(@Param("id") Long id, @Param("programId") Long programId);

    // Find an existing report for a given program, date, and shift (used to enforce one UCR per shift per day)
    ProgramUcrReport findFirstByProgram_IdAndReportDateAndShiftTime(Long programId, LocalDate reportDate, String shiftTime);
}

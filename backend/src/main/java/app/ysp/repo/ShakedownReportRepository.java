package app.ysp.repo;

import app.ysp.entity.ShakedownReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShakedownReportRepository extends JpaRepository<ShakedownReport, Long> {

    @Query("SELECT s FROM ShakedownReport s WHERE s.program.id = :programId ORDER BY s.shakedownDate DESC, s.createdAt DESC")
    List<ShakedownReport> findByProgramIdOrderByDateDesc(@Param("programId") Long programId);

    @Query("SELECT s FROM ShakedownReport s WHERE s.program.id = :programId AND s.status = :status ORDER BY s.shakedownDate DESC")
    List<ShakedownReport> findByProgramIdAndStatus(@Param("programId") Long programId, @Param("status") String status);

    @Query("SELECT s FROM ShakedownReport s WHERE s.program.id = :programId AND s.contrabandFound = :contrabandFound ORDER BY s.shakedownDate DESC")
    List<ShakedownReport> findByProgramIdAndContrabandFound(@Param("programId") Long programId, @Param("contrabandFound") Boolean contrabandFound);
}

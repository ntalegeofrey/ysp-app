package app.ysp.repo;

import app.ysp.entity.IncidentReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncidentReportRepository extends JpaRepository<IncidentReport, Long> {

    @Query("SELECT i FROM IncidentReport i WHERE i.program.id = :programId ORDER BY i.incidentDate DESC, i.incidentTime DESC")
    List<IncidentReport> findByProgramIdOrderByDateDesc(@Param("programId") Long programId);

    @Query("SELECT i FROM IncidentReport i WHERE i.program.id = :programId AND i.status = :status ORDER BY i.incidentDate DESC")
    List<IncidentReport> findByProgramIdAndStatus(@Param("programId") Long programId, @Param("status") String status);

    @Query("SELECT i FROM IncidentReport i WHERE i.program.id = :programId AND i.priority = :priority ORDER BY i.incidentDate DESC")
    List<IncidentReport> findByProgramIdAndPriority(@Param("programId") Long programId, @Param("priority") String priority);
}

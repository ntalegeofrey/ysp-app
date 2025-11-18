package app.ysp.repo;

import app.ysp.entity.FireDrillReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface FireDrillReportRepository extends JpaRepository<FireDrillReport, Long> {
    
    @Query("select r from FireDrillReport r where r.program.id = :programId and (:q is null or lower(coalesce(r.drillType,'')) like concat('%', lower(:q), '%') or lower(coalesce(r.status,'')) like concat('%', lower(:q), '%')) and (:drillType is null or lower(coalesce(r.drillType,'')) = lower(:drillType)) order by r.drillDate desc, r.drillTime desc, r.id desc")
    Page<FireDrillReport> findByFilters(@Param("programId") Long programId, @Param("q") String q, @Param("drillType") String drillType, Pageable pageable);

    @Query("select r from FireDrillReport r where r.id = :id and r.program.id = :programId")
    Optional<FireDrillReport> findByIdAndProgramId(@Param("id") Long id, @Param("programId") Long programId);
}

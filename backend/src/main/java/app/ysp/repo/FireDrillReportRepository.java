package app.ysp.repo;

import app.ysp.entity.FireDrillReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface FireDrillReportRepository extends JpaRepository<FireDrillReport, Long> {
    
    @Query(value = "SELECT * FROM fire_drill_reports r WHERE r.program_id = :programId AND (:q IS NULL OR LOWER(CAST(r.drill_type AS TEXT)) LIKE CONCAT('%', LOWER(:q), '%') OR LOWER(CAST(r.status AS TEXT)) LIKE CONCAT('%', LOWER(:q), '%')) AND (:drillType IS NULL OR LOWER(CAST(r.drill_type AS TEXT)) = LOWER(:drillType)) ORDER BY r.drill_date DESC, r.drill_time DESC, r.id DESC", 
           nativeQuery = true,
           countQuery = "SELECT COUNT(*) FROM fire_drill_reports r WHERE r.program_id = :programId AND (:q IS NULL OR LOWER(CAST(r.drill_type AS TEXT)) LIKE CONCAT('%', LOWER(:q), '%') OR LOWER(CAST(r.status AS TEXT)) LIKE CONCAT('%', LOWER(:q), '%')) AND (:drillType IS NULL OR LOWER(CAST(r.drill_type AS TEXT)) = LOWER(:drillType))")
    Page<FireDrillReport> findByFilters(@Param("programId") Long programId, @Param("q") String q, @Param("drillType") String drillType, Pageable pageable);

    @Query("select r from FireDrillReport r where r.id = :id and r.program.id = :programId")
    Optional<FireDrillReport> findByIdAndProgramId(@Param("id") Long id, @Param("programId") Long programId);
}

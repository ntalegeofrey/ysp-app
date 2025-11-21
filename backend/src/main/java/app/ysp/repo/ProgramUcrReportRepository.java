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

    // Stats queries - compute severity on-the-fly
    @Query(value = "SELECT COUNT(*) FROM program_ucr_reports r WHERE r.program_id = :programId " +
           "AND (LOWER(r.security_radios_condition) LIKE '%critical%' OR LOWER(r.security_flashlights_condition) LIKE '%critical%' " +
           "OR LOWER(r.security_metal_detector_condition) LIKE '%critical%' OR LOWER(r.security_big_set_keys_condition) LIKE '%critical%' " +
           "OR LOWER(r.security_first_aid_kits_condition) LIKE '%critical%' OR LOWER(r.security_desk_computer_condition) LIKE '%critical%' " +
           "OR LOWER(r.admin_meeting_rooms_locked_condition) LIKE '%critical%' OR LOWER(r.admin_doors_secure_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_back_door_condition) LIKE '%critical%' OR LOWER(r.infra_entrance_exit_doors_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_smoke_detectors_condition) LIKE '%critical%' OR LOWER(r.infra_windows_secure_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_laundry_area_condition) LIKE '%critical%' OR LOWER(r.infra_fire_extinguishers_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_fire_alarm_condition) LIKE '%critical%')", nativeQuery = true)
    long countCritical(@Param("programId") Long programId);

    @Query(value = "SELECT COUNT(*) FROM program_ucr_reports r WHERE r.program_id = :programId " +
           "AND (LOWER(r.security_radios_condition) LIKE '%high%' OR LOWER(r.security_flashlights_condition) LIKE '%high%' " +
           "OR LOWER(r.security_metal_detector_condition) LIKE '%high%' OR LOWER(r.security_big_set_keys_condition) LIKE '%high%' " +
           "OR LOWER(r.security_first_aid_kits_condition) LIKE '%high%' OR LOWER(r.security_desk_computer_condition) LIKE '%high%' " +
           "OR LOWER(r.admin_meeting_rooms_locked_condition) LIKE '%high%' OR LOWER(r.admin_doors_secure_condition) LIKE '%high%' " +
           "OR LOWER(r.infra_back_door_condition) LIKE '%high%' OR LOWER(r.infra_entrance_exit_doors_condition) LIKE '%high%' " +
           "OR LOWER(r.infra_smoke_detectors_condition) LIKE '%high%' OR LOWER(r.infra_windows_secure_condition) LIKE '%high%' " +
           "OR LOWER(r.infra_laundry_area_condition) LIKE '%high%' OR LOWER(r.infra_fire_extinguishers_condition) LIKE '%high%' " +
           "OR LOWER(r.infra_fire_alarm_condition) LIKE '%high%') " +
           "AND NOT (LOWER(r.security_radios_condition) LIKE '%critical%' OR LOWER(r.security_flashlights_condition) LIKE '%critical%' " +
           "OR LOWER(r.security_metal_detector_condition) LIKE '%critical%' OR LOWER(r.security_big_set_keys_condition) LIKE '%critical%' " +
           "OR LOWER(r.security_first_aid_kits_condition) LIKE '%critical%' OR LOWER(r.security_desk_computer_condition) LIKE '%critical%' " +
           "OR LOWER(r.admin_meeting_rooms_locked_condition) LIKE '%critical%' OR LOWER(r.admin_doors_secure_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_back_door_condition) LIKE '%critical%' OR LOWER(r.infra_entrance_exit_doors_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_smoke_detectors_condition) LIKE '%critical%' OR LOWER(r.infra_windows_secure_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_laundry_area_condition) LIKE '%critical%' OR LOWER(r.infra_fire_extinguishers_condition) LIKE '%critical%' " +
           "OR LOWER(r.infra_fire_alarm_condition) LIKE '%critical%')", nativeQuery = true)
    long countHigh(@Param("programId") Long programId);

    @Query("select r from ProgramUcrReport r where r.program.id = :programId order by r.reportDate desc, r.id desc")
    Page<ProgramUcrReport> findOpenIssues(@Param("programId") Long programId, Pageable pageable);

    @Query(value = "SELECT EXTRACT(MONTH FROM r.report_date)::int as month, " +
           "CASE " +
           "WHEN (LOWER(r.security_radios_condition) LIKE '%critical%' OR LOWER(r.security_flashlights_condition) LIKE '%critical%' " +
           "      OR LOWER(r.security_metal_detector_condition) LIKE '%critical%' OR LOWER(r.infra_fire_alarm_condition) LIKE '%critical%') THEN 'critical' " +
           "WHEN (LOWER(r.security_radios_condition) LIKE '%high%' OR LOWER(r.security_flashlights_condition) LIKE '%high%' " +
           "      OR LOWER(r.security_metal_detector_condition) LIKE '%high%' OR LOWER(r.infra_fire_alarm_condition) LIKE '%high%') THEN 'high' " +
           "WHEN (LOWER(r.security_radios_condition) LIKE '%medium%' OR LOWER(r.security_flashlights_condition) LIKE '%medium%' " +
           "      OR LOWER(r.security_metal_detector_condition) LIKE '%medium%' OR LOWER(r.infra_fire_alarm_condition) LIKE '%medium%') THEN 'medium' " +
           "ELSE 'normal' END as status, COUNT(*) as cnt " +
           "FROM program_ucr_reports r " +
           "WHERE r.program_id = :programId AND EXTRACT(YEAR FROM r.report_date) = :year " +
           "GROUP BY EXTRACT(MONTH FROM r.report_date), status " +
           "ORDER BY month", nativeQuery = true)
    List<Object[]> findMonthlyIssueCounts(@Param("programId") Long programId, @Param("year") int year);
}

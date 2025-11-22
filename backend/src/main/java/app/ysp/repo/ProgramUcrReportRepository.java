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

    @Query(value = "select * from program_ucr_reports r where r.program_id = :programId and (:q is null or lower(coalesce(r.additional_comments,'')) like concat('%', lower(cast(:q as text)), '%')) and (:date is null or r.report_date = :date) order by r.report_date desc, r.id desc", 
           countQuery = "select count(*) from program_ucr_reports r where r.program_id = :programId and (:q is null or lower(coalesce(r.additional_comments,'')) like concat('%', lower(cast(:q as text)), '%')) and (:date is null or r.report_date = :date)",
           nativeQuery = true)
    Page<ProgramUcrReport> findByFilters(@Param("programId") Long programId, @Param("q") String q, @Param("date") LocalDate date, Pageable pageable);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId")
    long countByProgramId(@Param("programId") Long programId);

    @Query("select count(r) from ProgramUcrReport r where r.program.id = :programId and r.reportDate between :start and :end")
    long countInRange(@Param("programId") Long programId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("select r from ProgramUcrReport r where r.id = :id and r.program.id = :programId")
    ProgramUcrReport findOneByIdAndProgram(@Param("id") Long id, @Param("programId") Long programId);

    // Find an existing report for a given program, date, and shift (used to enforce one UCR per shift per day)
    ProgramUcrReport findFirstByProgram_IdAndReportDateAndShiftTime(Long programId, LocalDate reportDate, String shiftTime);

    // Stats queries - compute severity on-the-fly, COUNT ONLY UNRESOLVED
    @Query(value = "SELECT COUNT(*) FROM program_ucr_reports r WHERE r.program_id = :programId " +
           "AND (r.resolved = false OR r.resolved IS NULL) " +
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
           "AND (r.resolved = false OR r.resolved IS NULL) " +
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

    // Count ALL individual unresolved issues (Critical + High + Medium) - excludes individually resolved issues
    @Query(value = "SELECT SUM(" +
           "  (CASE WHEN (LOWER(r.security_radios_condition) LIKE '%critical%' OR LOWER(r.security_radios_condition) LIKE '%high%' OR LOWER(r.security_radios_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%securityRadios%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.security_flashlights_condition) LIKE '%critical%' OR LOWER(r.security_flashlights_condition) LIKE '%high%' OR LOWER(r.security_flashlights_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%securityFlashlights%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.security_metal_detector_condition) LIKE '%critical%' OR LOWER(r.security_metal_detector_condition) LIKE '%high%' OR LOWER(r.security_metal_detector_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%securityMetalDetector%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.security_big_set_keys_condition) LIKE '%critical%' OR LOWER(r.security_big_set_keys_condition) LIKE '%high%' OR LOWER(r.security_big_set_keys_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%securityBigSetKeys%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.security_first_aid_kits_condition) LIKE '%critical%' OR LOWER(r.security_first_aid_kits_condition) LIKE '%high%' OR LOWER(r.security_first_aid_kits_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%securityFirstAidKits%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.security_desk_computer_condition) LIKE '%critical%' OR LOWER(r.security_desk_computer_condition) LIKE '%high%' OR LOWER(r.security_desk_computer_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%securityDeskComputer%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.admin_meeting_rooms_locked_condition) LIKE '%critical%' OR LOWER(r.admin_meeting_rooms_locked_condition) LIKE '%high%' OR LOWER(r.admin_meeting_rooms_locked_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%adminMeetingRoomsLocked%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.admin_doors_secure_condition) LIKE '%critical%' OR LOWER(r.admin_doors_secure_condition) LIKE '%high%' OR LOWER(r.admin_doors_secure_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%adminDoorsSecure%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_back_door_condition) LIKE '%critical%' OR LOWER(r.infra_back_door_condition) LIKE '%high%' OR LOWER(r.infra_back_door_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraBackDoor%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_entrance_exit_doors_condition) LIKE '%critical%' OR LOWER(r.infra_entrance_exit_doors_condition) LIKE '%high%' OR LOWER(r.infra_entrance_exit_doors_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraEntranceExitDoors%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_smoke_detectors_condition) LIKE '%critical%' OR LOWER(r.infra_smoke_detectors_condition) LIKE '%high%' OR LOWER(r.infra_smoke_detectors_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraSmokeDetectors%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_windows_secure_condition) LIKE '%critical%' OR LOWER(r.infra_windows_secure_condition) LIKE '%high%' OR LOWER(r.infra_windows_secure_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraWindowsSecure%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_laundry_area_condition) LIKE '%critical%' OR LOWER(r.infra_laundry_area_condition) LIKE '%high%' OR LOWER(r.infra_laundry_area_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraLaundryArea%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_fire_extinguishers_condition) LIKE '%critical%' OR LOWER(r.infra_fire_extinguishers_condition) LIKE '%high%' OR LOWER(r.infra_fire_extinguishers_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraFireExtinguishers%') THEN 1 ELSE 0 END) + " +
           "  (CASE WHEN (LOWER(r.infra_fire_alarm_condition) LIKE '%critical%' OR LOWER(r.infra_fire_alarm_condition) LIKE '%high%' OR LOWER(r.infra_fire_alarm_condition) LIKE '%medium%') AND (r.resolved_issues IS NULL OR r.resolved_issues NOT LIKE '%infraFireAlarm%') THEN 1 ELSE 0 END) " +
           ") FROM program_ucr_reports r " +
           "WHERE r.program_id = :programId", nativeQuery = true)
    Long countAllIssues(@Param("programId") Long programId);

    // Find reports with unresolved issues (not filtering by report.resolved since we track individual issues now)
    @Query("select r from ProgramUcrReport r where r.program.id = :programId and (r.securityRadiosCondition like '%Critical%' or r.securityRadiosCondition like '%High%' or r.securityRadiosCondition like '%Medium%' or r.securityFlashlightsCondition like '%Critical%' or r.securityFlashlightsCondition like '%High%' or r.securityFlashlightsCondition like '%Medium%' or r.securityMetalDetectorCondition like '%Critical%' or r.securityMetalDetectorCondition like '%High%' or r.securityMetalDetectorCondition like '%Medium%' or r.securityBigSetKeysCondition like '%Critical%' or r.securityBigSetKeysCondition like '%High%' or r.securityBigSetKeysCondition like '%Medium%' or r.securityFirstAidKitsCondition like '%Critical%' or r.securityFirstAidKitsCondition like '%High%' or r.securityFirstAidKitsCondition like '%Medium%' or r.securityDeskComputerCondition like '%Critical%' or r.securityDeskComputerCondition like '%High%' or r.securityDeskComputerCondition like '%Medium%' or r.adminMeetingRoomsLockedCondition like '%Critical%' or r.adminMeetingRoomsLockedCondition like '%High%' or r.adminMeetingRoomsLockedCondition like '%Medium%' or r.adminDoorsSecureCondition like '%Critical%' or r.adminDoorsSecureCondition like '%High%' or r.adminDoorsSecureCondition like '%Medium%' or r.infraBackDoorCondition like '%Critical%' or r.infraBackDoorCondition like '%High%' or r.infraBackDoorCondition like '%Medium%' or r.infraEntranceExitDoorsCondition like '%Critical%' or r.infraEntranceExitDoorsCondition like '%High%' or r.infraEntranceExitDoorsCondition like '%Medium%' or r.infraSmokeDetectorsCondition like '%Critical%' or r.infraSmokeDetectorsCondition like '%High%' or r.infraSmokeDetectorsCondition like '%Medium%' or r.infraWindowsSecureCondition like '%Critical%' or r.infraWindowsSecureCondition like '%High%' or r.infraWindowsSecureCondition like '%Medium%' or r.infraLaundryAreaCondition like '%Critical%' or r.infraLaundryAreaCondition like '%High%' or r.infraLaundryAreaCondition like '%Medium%' or r.infraFireExtinguishersCondition like '%Critical%' or r.infraFireExtinguishersCondition like '%High%' or r.infraFireExtinguishersCondition like '%Medium%' or r.infraFireAlarmCondition like '%Critical%' or r.infraFireAlarmCondition like '%High%' or r.infraFireAlarmCondition like '%Medium%') order by r.reportDate desc, r.id desc")
    Page<ProgramUcrReport> findOpenIssues(@Param("programId") Long programId, Pageable pageable);

    @Query(value = "WITH all_conditions AS (" +
           "  SELECT r.id, EXTRACT(MONTH FROM r.report_date)::int as month, " +
           "    LOWER(r.security_radios_condition) as cond FROM program_ucr_reports r WHERE r.program_id = :programId AND EXTRACT(YEAR FROM r.report_date) = :year " +
           "  UNION ALL SELECT r.id, EXTRACT(MONTH FROM r.report_date)::int, LOWER(r.security_flashlights_condition) FROM program_ucr_reports r WHERE r.program_id = :programId AND EXTRACT(YEAR FROM r.report_date) = :year " +
           "  UNION ALL SELECT r.id, EXTRACT(MONTH FROM r.report_date)::int, LOWER(r.security_metal_detector_condition) FROM program_ucr_reports r WHERE r.program_id = :programId AND EXTRACT(YEAR FROM r.report_date) = :year " +
           "  UNION ALL SELECT r.id, EXTRACT(MONTH FROM r.report_date)::int, LOWER(r.security_big_set_keys_condition) FROM program_ucr_reports r WHERE r.program_id = :programId AND EXTRACT(YEAR FROM r.report_date) = :year " +
           "  UNION ALL SELECT r.id, EXTRACT(MONTH FROM r.report_date)::int, LOWER(r.infra_fire_alarm_condition) FROM program_ucr_reports r WHERE r.program_id = :programId AND EXTRACT(YEAR FROM r.report_date) = :year " +
           ") " +
           "SELECT month, " +
           "  CASE WHEN cond LIKE '%critical%' THEN 'critical' WHEN cond LIKE '%high%' THEN 'high' WHEN cond LIKE '%medium%' THEN 'medium' ELSE NULL END as status, " +
           "  COUNT(DISTINCT id) as cnt " +
           "FROM all_conditions " +
           "WHERE cond LIKE '%critical%' OR cond LIKE '%high%' OR cond LIKE '%medium%' " +
           "GROUP BY month, status " +
           "ORDER BY month", nativeQuery = true)
    List<Object[]> findMonthlyIssueCounts(@Param("programId") Long programId, @Param("year") int year);
}

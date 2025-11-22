package app.ysp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "program_ucr_reports")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProgramUcrReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "staff_id")
    private Long staffId;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "shift_time")
    private String shiftTime;

    @Column(name = "is_locked")
    private Boolean isLocked = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Security Equipment (6 items)
    @Column(name = "security_radios_status")
    private String securityRadiosStatus;
    @Column(name = "security_radios_condition")
    private String securityRadiosCondition;
    @Column(name = "security_radios_comments")
    private String securityRadiosComments;

    @Column(name = "security_flashlights_status")
    private String securityFlashlightsStatus;
    @Column(name = "security_flashlights_condition")
    private String securityFlashlightsCondition;
    @Column(name = "security_flashlights_comments")
    private String securityFlashlightsComments;

    @Column(name = "security_metal_detector_status")
    private String securityMetalDetectorStatus;
    @Column(name = "security_metal_detector_condition")
    private String securityMetalDetectorCondition;
    @Column(name = "security_metal_detector_comments")
    private String securityMetalDetectorComments;

    @Column(name = "security_big_set_keys_status")
    private String securityBigSetKeysStatus;
    @Column(name = "security_big_set_keys_condition")
    private String securityBigSetKeysCondition;
    @Column(name = "security_big_set_keys_comments")
    private String securityBigSetKeysComments;

    @Column(name = "security_first_aid_kits_status")
    private String securityFirstAidKitsStatus;
    @Column(name = "security_first_aid_kits_condition")
    private String securityFirstAidKitsCondition;
    @Column(name = "security_first_aid_kits_comments")
    private String securityFirstAidKitsComments;

    @Column(name = "security_desk_computer_status")
    private String securityDeskComputerStatus;
    @Column(name = "security_desk_computer_condition")
    private String securityDeskComputerCondition;
    @Column(name = "security_desk_computer_comments")
    private String securityDeskComputerComments;

    // Hardware and Searches
    @Column(name = "hardware_secure_yes_no")
    private String hardwareSecureYesNo;
    @Column(name = "hardware_secure_comments")
    private String hardwareSecureComments;

    @Column(name = "searches_completed_yes_no")
    private String searchesCompletedYesNo;

    @Column(name = "fire_drills_completed_yes_no")
    private String fireDrillsCompletedYesNo;
    @Column(name = "fire_drills_completed_comments")
    private String fireDrillsCompletedComments;

    @Column(name = "emergency_lighting_yes_no")
    private String emergencyLightingYesNo;
    @Column(name = "emergency_lighting_comments")
    private String emergencyLightingComments;

    // Notifications
    @Column(name = "notifications_opposite_gender_yes_no")
    private String notificationsOppositeGenderYesNo;
    @Column(name = "notifications_opposite_gender_condition")
    private String notificationsOppositeGenderCondition;
    @Column(name = "notifications_opposite_gender_comments")
    private String notificationsOppositeGenderComments;

    // Admin Offices
    @Column(name = "admin_meeting_rooms_locked_status")
    private String adminMeetingRoomsLockedStatus;
    @Column(name = "admin_meeting_rooms_locked_condition")
    private String adminMeetingRoomsLockedCondition;
    @Column(name = "admin_meeting_rooms_locked_comments")
    private String adminMeetingRoomsLockedComments;

    @Column(name = "admin_doors_secure_status")
    private String adminDoorsSecureStatus;
    @Column(name = "admin_doors_secure_condition")
    private String adminDoorsSecureCondition;
    @Column(name = "admin_doors_secure_comments")
    private String adminDoorsSecureComments;

    // Facility Infrastructure
    @Column(name = "infra_back_door_status")
    private String infraBackDoorStatus;
    @Column(name = "infra_back_door_condition")
    private String infraBackDoorCondition;
    @Column(name = "infra_back_door_comments")
    private String infraBackDoorComments;

    @Column(name = "infra_entrance_exit_doors_status")
    private String infraEntranceExitDoorsStatus;
    @Column(name = "infra_entrance_exit_doors_condition")
    private String infraEntranceExitDoorsCondition;
    @Column(name = "infra_entrance_exit_doors_comments")
    private String infraEntranceExitDoorsComments;

    @Column(name = "infra_smoke_detectors_status")
    private String infraSmokeDetectorsStatus;
    @Column(name = "infra_smoke_detectors_condition")
    private String infraSmokeDetectorsCondition;
    @Column(name = "infra_smoke_detectors_comments")
    private String infraSmokeDetectorsComments;

    @Column(name = "infra_windows_secure_status")
    private String infraWindowsSecureStatus;
    @Column(name = "infra_windows_secure_condition")
    private String infraWindowsSecureCondition;
    @Column(name = "infra_windows_secure_comments")
    private String infraWindowsSecureComments;

    @Column(name = "infra_laundry_area_status")
    private String infraLaundryAreaStatus;
    @Column(name = "infra_laundry_area_condition")
    private String infraLaundryAreaCondition;
    @Column(name = "infra_laundry_area_comments")
    private String infraLaundryAreaComments;

    @Column(name = "infra_fire_extinguishers_status")
    private String infraFireExtinguishersStatus;
    @Column(name = "infra_fire_extinguishers_condition")
    private String infraFireExtinguishersCondition;
    @Column(name = "infra_fire_extinguishers_comments")
    private String infraFireExtinguishersComments;

    @Column(name = "infra_fire_alarm_status")
    private String infraFireAlarmStatus;
    @Column(name = "infra_fire_alarm_condition")
    private String infraFireAlarmCondition;
    @Column(name = "infra_fire_alarm_comments")
    private String infraFireAlarmComments;

    // Chore Workspace
    @Column(name = "chore_workspace_clean_status")
    private String choreWorkspaceCleanStatus;
    @Column(name = "chore_workspace_clean_comments")
    private String choreWorkspaceCleanComments;

    @Column(name = "chore_staff_bathroom_status")
    private String choreStaffBathroomStatus;
    @Column(name = "chore_staff_bathroom_comments")
    private String choreStaffBathroomComments;

    @Column(name = "chore_dayroom_clean_status")
    private String choreDayroomCleanStatus;
    @Column(name = "chore_dayroom_clean_comments")
    private String choreDayroomCleanComments;

    @Column(name = "chore_laundry_room_clean_status")
    private String choreLaundryRoomCleanStatus;
    @Column(name = "chore_laundry_room_clean_comments")
    private String choreLaundryRoomCleanComments;

    // Room searches as JSONB array (stored as TEXT to avoid Hibernate bytea issues)
    @Column(name = "room_searches")
    private String roomSearches;

    // Additional comments
    @Column(name = "additional_comments")
    private String additionalComments;

    // Resolution tracking
    @Column(name = "resolved")
    private Boolean resolved = false;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
    
    @Column(name = "resolved_by")
    private Long resolvedBy;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Compute the severity/status of this UCR report based on all condition/priority fields.
     * Returns: "Critical", "High", "Medium", or "Normal"
     */
    @Transient
    public String getComputedSeverity() {
        List<String> allConditions = Arrays.asList(
            securityRadiosCondition, securityFlashlightsCondition, securityMetalDetectorCondition,
            securityBigSetKeysCondition, securityFirstAidKitsCondition, securityDeskComputerCondition,
            notificationsOppositeGenderCondition,
            adminMeetingRoomsLockedCondition, adminDoorsSecureCondition,
            infraBackDoorCondition, infraEntranceExitDoorsCondition, infraSmokeDetectorsCondition,
            infraWindowsSecureCondition, infraLaundryAreaCondition, infraFireExtinguishersCondition,
            infraFireAlarmCondition
        );
        
        for (String c : allConditions) {
            if (c != null && c.toLowerCase().contains("critical")) return "Critical";
        }
        for (String c : allConditions) {
            if (c != null && c.toLowerCase().contains("high")) return "High";
        }
        for (String c : allConditions) {
            if (c != null && c.toLowerCase().contains("medium")) return "Medium";
        }
        return "Normal";
    }

    /**
     * Generate a brief summary of issues for display in tables/lists
     */
    @Transient
    public String getIssuesSummary() {
        StringBuilder summary = new StringBuilder();
        int issueCount = 0;
        
        if (securityRadiosCondition != null && !securityRadiosCondition.equalsIgnoreCase("normal")) {
            summary.append("Radios: ").append(securityRadiosCondition).append("; ");
            issueCount++;
        }
        if (securityFlashlightsCondition != null && !securityFlashlightsCondition.equalsIgnoreCase("normal")) {
            summary.append("Flashlights: ").append(securityFlashlightsCondition).append("; ");
            issueCount++;
        }
        if (infraFireAlarmCondition != null && !infraFireAlarmCondition.equalsIgnoreCase("normal")) {
            summary.append("Fire Alarm: ").append(infraFireAlarmCondition).append("; ");
            issueCount++;
        }
        
        if (summary.length() > 0) {
            return summary.toString().trim();
        }
        
        return additionalComments != null && !additionalComments.isBlank() 
            ? additionalComments.substring(0, Math.min(100, additionalComments.length())) + "..."
            : "No issues reported";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }

    public String getShiftTime() { return shiftTime; }
    public void setShiftTime(String shiftTime) { this.shiftTime = shiftTime; }

    public Boolean getIsLocked() { return isLocked; }
    public void setIsLocked(Boolean isLocked) { this.isLocked = isLocked; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Security Equipment getters/setters
    public String getSecurityRadiosStatus() { return securityRadiosStatus; }
    public void setSecurityRadiosStatus(String securityRadiosStatus) { this.securityRadiosStatus = securityRadiosStatus; }
    public String getSecurityRadiosCondition() { return securityRadiosCondition; }
    public void setSecurityRadiosCondition(String securityRadiosCondition) { this.securityRadiosCondition = securityRadiosCondition; }
    public String getSecurityRadiosComments() { return securityRadiosComments; }
    public void setSecurityRadiosComments(String securityRadiosComments) { this.securityRadiosComments = securityRadiosComments; }

    public String getSecurityFlashlightsStatus() { return securityFlashlightsStatus; }
    public void setSecurityFlashlightsStatus(String securityFlashlightsStatus) { this.securityFlashlightsStatus = securityFlashlightsStatus; }
    public String getSecurityFlashlightsCondition() { return securityFlashlightsCondition; }
    public void setSecurityFlashlightsCondition(String securityFlashlightsCondition) { this.securityFlashlightsCondition = securityFlashlightsCondition; }
    public String getSecurityFlashlightsComments() { return securityFlashlightsComments; }
    public void setSecurityFlashlightsComments(String securityFlashlightsComments) { this.securityFlashlightsComments = securityFlashlightsComments; }

    public String getSecurityMetalDetectorStatus() { return securityMetalDetectorStatus; }
    public void setSecurityMetalDetectorStatus(String securityMetalDetectorStatus) { this.securityMetalDetectorStatus = securityMetalDetectorStatus; }
    public String getSecurityMetalDetectorCondition() { return securityMetalDetectorCondition; }
    public void setSecurityMetalDetectorCondition(String securityMetalDetectorCondition) { this.securityMetalDetectorCondition = securityMetalDetectorCondition; }
    public String getSecurityMetalDetectorComments() { return securityMetalDetectorComments; }
    public void setSecurityMetalDetectorComments(String securityMetalDetectorComments) { this.securityMetalDetectorComments = securityMetalDetectorComments; }

    public String getSecurityBigSetKeysStatus() { return securityBigSetKeysStatus; }
    public void setSecurityBigSetKeysStatus(String securityBigSetKeysStatus) { this.securityBigSetKeysStatus = securityBigSetKeysStatus; }
    public String getSecurityBigSetKeysCondition() { return securityBigSetKeysCondition; }
    public void setSecurityBigSetKeysCondition(String securityBigSetKeysCondition) { this.securityBigSetKeysCondition = securityBigSetKeysCondition; }
    public String getSecurityBigSetKeysComments() { return securityBigSetKeysComments; }
    public void setSecurityBigSetKeysComments(String securityBigSetKeysComments) { this.securityBigSetKeysComments = securityBigSetKeysComments; }

    public String getSecurityFirstAidKitsStatus() { return securityFirstAidKitsStatus; }
    public void setSecurityFirstAidKitsStatus(String securityFirstAidKitsStatus) { this.securityFirstAidKitsStatus = securityFirstAidKitsStatus; }
    public String getSecurityFirstAidKitsCondition() { return securityFirstAidKitsCondition; }
    public void setSecurityFirstAidKitsCondition(String securityFirstAidKitsCondition) { this.securityFirstAidKitsCondition = securityFirstAidKitsCondition; }
    public String getSecurityFirstAidKitsComments() { return securityFirstAidKitsComments; }
    public void setSecurityFirstAidKitsComments(String securityFirstAidKitsComments) { this.securityFirstAidKitsComments = securityFirstAidKitsComments; }

    public String getSecurityDeskComputerStatus() { return securityDeskComputerStatus; }
    public void setSecurityDeskComputerStatus(String securityDeskComputerStatus) { this.securityDeskComputerStatus = securityDeskComputerStatus; }
    public String getSecurityDeskComputerCondition() { return securityDeskComputerCondition; }
    public void setSecurityDeskComputerCondition(String securityDeskComputerCondition) { this.securityDeskComputerCondition = securityDeskComputerCondition; }
    public String getSecurityDeskComputerComments() { return securityDeskComputerComments; }
    public void setSecurityDeskComputerComments(String securityDeskComputerComments) { this.securityDeskComputerComments = securityDeskComputerComments; }

    // Hardware and Searches getters/setters
    public String getHardwareSecureYesNo() { return hardwareSecureYesNo; }
    public void setHardwareSecureYesNo(String hardwareSecureYesNo) { this.hardwareSecureYesNo = hardwareSecureYesNo; }
    public String getHardwareSecureComments() { return hardwareSecureComments; }
    public void setHardwareSecureComments(String hardwareSecureComments) { this.hardwareSecureComments = hardwareSecureComments; }

    public String getSearchesCompletedYesNo() { return searchesCompletedYesNo; }
    public void setSearchesCompletedYesNo(String searchesCompletedYesNo) { this.searchesCompletedYesNo = searchesCompletedYesNo; }

    public String getFireDrillsCompletedYesNo() { return fireDrillsCompletedYesNo; }
    public void setFireDrillsCompletedYesNo(String fireDrillsCompletedYesNo) { this.fireDrillsCompletedYesNo = fireDrillsCompletedYesNo; }
    public String getFireDrillsCompletedComments() { return fireDrillsCompletedComments; }
    public void setFireDrillsCompletedComments(String fireDrillsCompletedComments) { this.fireDrillsCompletedComments = fireDrillsCompletedComments; }

    public String getEmergencyLightingYesNo() { return emergencyLightingYesNo; }
    public void setEmergencyLightingYesNo(String emergencyLightingYesNo) { this.emergencyLightingYesNo = emergencyLightingYesNo; }
    public String getEmergencyLightingComments() { return emergencyLightingComments; }
    public void setEmergencyLightingComments(String emergencyLightingComments) { this.emergencyLightingComments = emergencyLightingComments; }

    // Notifications getters/setters
    public String getNotificationsOppositeGenderYesNo() { return notificationsOppositeGenderYesNo; }
    public void setNotificationsOppositeGenderYesNo(String notificationsOppositeGenderYesNo) { this.notificationsOppositeGenderYesNo = notificationsOppositeGenderYesNo; }
    public String getNotificationsOppositeGenderCondition() { return notificationsOppositeGenderCondition; }
    public void setNotificationsOppositeGenderCondition(String notificationsOppositeGenderCondition) { this.notificationsOppositeGenderCondition = notificationsOppositeGenderCondition; }
    public String getNotificationsOppositeGenderComments() { return notificationsOppositeGenderComments; }
    public void setNotificationsOppositeGenderComments(String notificationsOppositeGenderComments) { this.notificationsOppositeGenderComments = notificationsOppositeGenderComments; }

    // Admin Offices getters/setters
    public String getAdminMeetingRoomsLockedStatus() { return adminMeetingRoomsLockedStatus; }
    public void setAdminMeetingRoomsLockedStatus(String adminMeetingRoomsLockedStatus) { this.adminMeetingRoomsLockedStatus = adminMeetingRoomsLockedStatus; }
    public String getAdminMeetingRoomsLockedCondition() { return adminMeetingRoomsLockedCondition; }
    public void setAdminMeetingRoomsLockedCondition(String adminMeetingRoomsLockedCondition) { this.adminMeetingRoomsLockedCondition = adminMeetingRoomsLockedCondition; }
    public String getAdminMeetingRoomsLockedComments() { return adminMeetingRoomsLockedComments; }
    public void setAdminMeetingRoomsLockedComments(String adminMeetingRoomsLockedComments) { this.adminMeetingRoomsLockedComments = adminMeetingRoomsLockedComments; }

    public String getAdminDoorsSecureStatus() { return adminDoorsSecureStatus; }
    public void setAdminDoorsSecureStatus(String adminDoorsSecureStatus) { this.adminDoorsSecureStatus = adminDoorsSecureStatus; }
    public String getAdminDoorsSecureCondition() { return adminDoorsSecureCondition; }
    public void setAdminDoorsSecureCondition(String adminDoorsSecureCondition) { this.adminDoorsSecureCondition = adminDoorsSecureCondition; }
    public String getAdminDoorsSecureComments() { return adminDoorsSecureComments; }
    public void setAdminDoorsSecureComments(String adminDoorsSecureComments) { this.adminDoorsSecureComments = adminDoorsSecureComments; }

    // Infrastructure getters/setters
    public String getInfraBackDoorStatus() { return infraBackDoorStatus; }
    public void setInfraBackDoorStatus(String infraBackDoorStatus) { this.infraBackDoorStatus = infraBackDoorStatus; }
    public String getInfraBackDoorCondition() { return infraBackDoorCondition; }
    public void setInfraBackDoorCondition(String infraBackDoorCondition) { this.infraBackDoorCondition = infraBackDoorCondition; }
    public String getInfraBackDoorComments() { return infraBackDoorComments; }
    public void setInfraBackDoorComments(String infraBackDoorComments) { this.infraBackDoorComments = infraBackDoorComments; }

    public String getInfraEntranceExitDoorsStatus() { return infraEntranceExitDoorsStatus; }
    public void setInfraEntranceExitDoorsStatus(String infraEntranceExitDoorsStatus) { this.infraEntranceExitDoorsStatus = infraEntranceExitDoorsStatus; }
    public String getInfraEntranceExitDoorsCondition() { return infraEntranceExitDoorsCondition; }
    public void setInfraEntranceExitDoorsCondition(String infraEntranceExitDoorsCondition) { this.infraEntranceExitDoorsCondition = infraEntranceExitDoorsCondition; }
    public String getInfraEntranceExitDoorsComments() { return infraEntranceExitDoorsComments; }
    public void setInfraEntranceExitDoorsComments(String infraEntranceExitDoorsComments) { this.infraEntranceExitDoorsComments = infraEntranceExitDoorsComments; }

    public String getInfraSmokeDetectorsStatus() { return infraSmokeDetectorsStatus; }
    public void setInfraSmokeDetectorsStatus(String infraSmokeDetectorsStatus) { this.infraSmokeDetectorsStatus = infraSmokeDetectorsStatus; }
    public String getInfraSmokeDetectorsCondition() { return infraSmokeDetectorsCondition; }
    public void setInfraSmokeDetectorsCondition(String infraSmokeDetectorsCondition) { this.infraSmokeDetectorsCondition = infraSmokeDetectorsCondition; }
    public String getInfraSmokeDetectorsComments() { return infraSmokeDetectorsComments; }
    public void setInfraSmokeDetectorsComments(String infraSmokeDetectorsComments) { this.infraSmokeDetectorsComments = infraSmokeDetectorsComments; }

    public String getInfraWindowsSecureStatus() { return infraWindowsSecureStatus; }
    public void setInfraWindowsSecureStatus(String infraWindowsSecureStatus) { this.infraWindowsSecureStatus = infraWindowsSecureStatus; }
    public String getInfraWindowsSecureCondition() { return infraWindowsSecureCondition; }
    public void setInfraWindowsSecureCondition(String infraWindowsSecureCondition) { this.infraWindowsSecureCondition = infraWindowsSecureCondition; }
    public String getInfraWindowsSecureComments() { return infraWindowsSecureComments; }
    public void setInfraWindowsSecureComments(String infraWindowsSecureComments) { this.infraWindowsSecureComments = infraWindowsSecureComments; }

    public String getInfraLaundryAreaStatus() { return infraLaundryAreaStatus; }
    public void setInfraLaundryAreaStatus(String infraLaundryAreaStatus) { this.infraLaundryAreaStatus = infraLaundryAreaStatus; }
    public String getInfraLaundryAreaCondition() { return infraLaundryAreaCondition; }
    public void setInfraLaundryAreaCondition(String infraLaundryAreaCondition) { this.infraLaundryAreaCondition = infraLaundryAreaCondition; }
    public String getInfraLaundryAreaComments() { return infraLaundryAreaComments; }
    public void setInfraLaundryAreaComments(String infraLaundryAreaComments) { this.infraLaundryAreaComments = infraLaundryAreaComments; }

    public String getInfraFireExtinguishersStatus() { return infraFireExtinguishersStatus; }
    public void setInfraFireExtinguishersStatus(String infraFireExtinguishersStatus) { this.infraFireExtinguishersStatus = infraFireExtinguishersStatus; }
    public String getInfraFireExtinguishersCondition() { return infraFireExtinguishersCondition; }
    public void setInfraFireExtinguishersCondition(String infraFireExtinguishersCondition) { this.infraFireExtinguishersCondition = infraFireExtinguishersCondition; }
    public String getInfraFireExtinguishersComments() { return infraFireExtinguishersComments; }
    public void setInfraFireExtinguishersComments(String infraFireExtinguishersComments) { this.infraFireExtinguishersComments = infraFireExtinguishersComments; }

    public String getInfraFireAlarmStatus() { return infraFireAlarmStatus; }
    public void setInfraFireAlarmStatus(String infraFireAlarmStatus) { this.infraFireAlarmStatus = infraFireAlarmStatus; }
    public String getInfraFireAlarmCondition() { return infraFireAlarmCondition; }
    public void setInfraFireAlarmCondition(String infraFireAlarmCondition) { this.infraFireAlarmCondition = infraFireAlarmCondition; }
    public String getInfraFireAlarmComments() { return infraFireAlarmComments; }
    public void setInfraFireAlarmComments(String infraFireAlarmComments) { this.infraFireAlarmComments = infraFireAlarmComments; }

    // Chore Workspace getters/setters
    public String getChoreWorkspaceCleanStatus() { return choreWorkspaceCleanStatus; }
    public void setChoreWorkspaceCleanStatus(String choreWorkspaceCleanStatus) { this.choreWorkspaceCleanStatus = choreWorkspaceCleanStatus; }
    public String getChoreWorkspaceCleanComments() { return choreWorkspaceCleanComments; }
    public void setChoreWorkspaceCleanComments(String choreWorkspaceCleanComments) { this.choreWorkspaceCleanComments = choreWorkspaceCleanComments; }

    public String getChoreStaffBathroomStatus() { return choreStaffBathroomStatus; }
    public void setChoreStaffBathroomStatus(String choreStaffBathroomStatus) { this.choreStaffBathroomStatus = choreStaffBathroomStatus; }
    public String getChoreStaffBathroomComments() { return choreStaffBathroomComments; }
    public void setChoreStaffBathroomComments(String choreStaffBathroomComments) { this.choreStaffBathroomComments = choreStaffBathroomComments; }

    public String getChoreDayroomCleanStatus() { return choreDayroomCleanStatus; }
    public void setChoreDayroomCleanStatus(String choreDayroomCleanStatus) { this.choreDayroomCleanStatus = choreDayroomCleanStatus; }
    public String getChoreDayroomCleanComments() { return choreDayroomCleanComments; }
    public void setChoreDayroomCleanComments(String choreDayroomCleanComments) { this.choreDayroomCleanComments = choreDayroomCleanComments; }

    public String getChoreLaundryRoomCleanStatus() { return choreLaundryRoomCleanStatus; }
    public void setChoreLaundryRoomCleanStatus(String choreLaundryRoomCleanStatus) { this.choreLaundryRoomCleanStatus = choreLaundryRoomCleanStatus; }
    public String getChoreLaundryRoomCleanComments() { return choreLaundryRoomCleanComments; }
    public void setChoreLaundryRoomCleanComments(String choreLaundryRoomCleanComments) { this.choreLaundryRoomCleanComments = choreLaundryRoomCleanComments; }

    // Room searches and additional comments
    public String getRoomSearches() { return roomSearches; }
    public void setRoomSearches(String roomSearches) { this.roomSearches = roomSearches; }

    public String getAdditionalComments() { return additionalComments; }
    public void setAdditionalComments(String additionalComments) { this.additionalComments = additionalComments; }

    public Boolean getResolved() { return resolved; }
    public void setResolved(Boolean resolved) { this.resolved = resolved; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public Long getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(Long resolvedBy) { this.resolvedBy = resolvedBy; }
}

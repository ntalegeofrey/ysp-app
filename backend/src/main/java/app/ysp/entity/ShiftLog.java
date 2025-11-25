package app.ysp.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "shift_logs")
public class ShiftLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @Column(name = "shift_date", nullable = false)
    private LocalDate shiftDate;
    
    @Column(name = "shift_type", nullable = false, length = 100)
    private String shiftType;
    
    @Column(name = "unit_supervisor", length = 255)
    private String unitSupervisor;
    
    // Residents Information
    @Column(name = "resident_initials", columnDefinition = "TEXT")
    private String residentInitials;
    
    @Column(name = "resident_count")
    private Integer residentCount;
    
    @Column(name = "resident_comments", columnDefinition = "TEXT")
    private String residentComments;
    
    // Events & Documentation
    @Column(name = "incidents_events", columnDefinition = "TEXT")
    private String incidentsEvents;
    
    // Shift Summary
    @Column(name = "overall_status", length = 50)
    private String overallStatus;
    
    @Column(name = "follow_up_required", length = 100)
    private String followUpRequired;
    
    @Column(name = "shift_summary", columnDefinition = "TEXT")
    private String shiftSummary;
    
    // JSON fields
    @Column(name = "staff_assignments_json", columnDefinition = "TEXT")
    private String staffAssignmentsJson;
    
    @Column(name = "equipment_counts_json", columnDefinition = "TEXT")
    private String equipmentCountsJson;
    
    // Certification
    @Column(name = "certification_complete", nullable = false)
    private Boolean certificationComplete = false;
    
    @Column(name = "cert_equipment_verified", nullable = false)
    private Boolean certEquipmentVerified = false;
    
    @Column(name = "cert_shift_events_accurate", nullable = false)
    private Boolean certShiftEventsAccurate = false;
    
    @Column(name = "certification_datetime")
    private Instant certificationDatetime;
    
    @Column(name = "report_completed_by", length = 255)
    private String reportCompletedBy;
    
    @Column(name = "report_completed_by_email", length = 255)
    private String reportCompletedByEmail;
    
    // Audit fields
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @Column(name = "status", length = 50)
    private String status;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (status == null) {
            status = "Submitted";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Program getProgram() {
        return program;
    }
    
    public void setProgram(Program program) {
        this.program = program;
    }
    
    public LocalDate getShiftDate() {
        return shiftDate;
    }
    
    public void setShiftDate(LocalDate shiftDate) {
        this.shiftDate = shiftDate;
    }
    
    public String getShiftType() {
        return shiftType;
    }
    
    public void setShiftType(String shiftType) {
        this.shiftType = shiftType;
    }
    
    public String getUnitSupervisor() {
        return unitSupervisor;
    }
    
    public void setUnitSupervisor(String unitSupervisor) {
        this.unitSupervisor = unitSupervisor;
    }
    
    public String getResidentInitials() {
        return residentInitials;
    }
    
    public void setResidentInitials(String residentInitials) {
        this.residentInitials = residentInitials;
    }
    
    public Integer getResidentCount() {
        return residentCount;
    }
    
    public void setResidentCount(Integer residentCount) {
        this.residentCount = residentCount;
    }
    
    public String getResidentComments() {
        return residentComments;
    }
    
    public void setResidentComments(String residentComments) {
        this.residentComments = residentComments;
    }
    
    public String getIncidentsEvents() {
        return incidentsEvents;
    }
    
    public void setIncidentsEvents(String incidentsEvents) {
        this.incidentsEvents = incidentsEvents;
    }
    
    public String getOverallStatus() {
        return overallStatus;
    }
    
    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }
    
    public String getFollowUpRequired() {
        return followUpRequired;
    }
    
    public void setFollowUpRequired(String followUpRequired) {
        this.followUpRequired = followUpRequired;
    }
    
    public String getShiftSummary() {
        return shiftSummary;
    }
    
    public void setShiftSummary(String shiftSummary) {
        this.shiftSummary = shiftSummary;
    }
    
    public String getStaffAssignmentsJson() {
        return staffAssignmentsJson;
    }
    
    public void setStaffAssignmentsJson(String staffAssignmentsJson) {
        this.staffAssignmentsJson = staffAssignmentsJson;
    }
    
    public String getEquipmentCountsJson() {
        return equipmentCountsJson;
    }
    
    public void setEquipmentCountsJson(String equipmentCountsJson) {
        this.equipmentCountsJson = equipmentCountsJson;
    }
    
    public Boolean getCertificationComplete() {
        return certificationComplete;
    }
    
    public void setCertificationComplete(Boolean certificationComplete) {
        this.certificationComplete = certificationComplete;
    }
    
    public Boolean getCertEquipmentVerified() {
        return certEquipmentVerified;
    }
    
    public void setCertEquipmentVerified(Boolean certEquipmentVerified) {
        this.certEquipmentVerified = certEquipmentVerified;
    }
    
    public Boolean getCertShiftEventsAccurate() {
        return certShiftEventsAccurate;
    }
    
    public void setCertShiftEventsAccurate(Boolean certShiftEventsAccurate) {
        this.certShiftEventsAccurate = certShiftEventsAccurate;
    }
    
    public Instant getCertificationDatetime() {
        return certificationDatetime;
    }
    
    public void setCertificationDatetime(Instant certificationDatetime) {
        this.certificationDatetime = certificationDatetime;
    }
    
    public String getReportCompletedBy() {
        return reportCompletedBy;
    }
    
    public void setReportCompletedBy(String reportCompletedBy) {
        this.reportCompletedBy = reportCompletedBy;
    }
    
    public String getReportCompletedByEmail() {
        return reportCompletedByEmail;
    }
    
    public void setReportCompletedByEmail(String reportCompletedByEmail) {
        this.reportCompletedByEmail = reportCompletedByEmail;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    
    public Instant getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}

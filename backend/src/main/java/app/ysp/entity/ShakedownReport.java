package app.ysp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "shakedown_reports")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ShakedownReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "shakedown_date", nullable = false)
    private LocalDate shakedownDate;

    @Column(name = "shift", length = 50)
    private String shift;

    @Column(name = "common_area_searches", columnDefinition = "TEXT")
    private String commonAreaSearches;

    @Column(name = "school_area_searches", columnDefinition = "TEXT")
    private String schoolAreaSearches;

    @Column(name = "resident_room_searches", columnDefinition = "TEXT")
    private String residentRoomSearches;

    @Column(name = "equipment_condition", columnDefinition = "TEXT")
    private String equipmentCondition;

    @Column(name = "announcement_time")
    private LocalTime announcementTime;

    @Column(name = "announcement_staff")
    private String announcementStaff;

    @Column(name = "announcement_areas", columnDefinition = "TEXT")
    private String announcementAreas;

    @Column(name = "additional_comments", columnDefinition = "TEXT")
    private String additionalComments;

    @Column(name = "report_completed_by", nullable = false)
    private String reportCompletedBy;

    @Column(name = "report_completed_by_email")
    private String reportCompletedByEmail;

    @Column(name = "signature_datetime", nullable = false)
    private LocalDateTime signatureDatetime;

    @Column(name = "certification_complete")
    private Boolean certificationComplete = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "status", length = 50)
    private String status = "Submitted";

    @Column(name = "contraband_found")
    private Boolean contrabandFound = false;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public LocalDate getShakedownDate() { return shakedownDate; }
    public void setShakedownDate(LocalDate shakedownDate) { this.shakedownDate = shakedownDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getCommonAreaSearches() { return commonAreaSearches; }
    public void setCommonAreaSearches(String commonAreaSearches) { this.commonAreaSearches = commonAreaSearches; }

    public String getSchoolAreaSearches() { return schoolAreaSearches; }
    public void setSchoolAreaSearches(String schoolAreaSearches) { this.schoolAreaSearches = schoolAreaSearches; }

    public String getResidentRoomSearches() { return residentRoomSearches; }
    public void setResidentRoomSearches(String residentRoomSearches) { this.residentRoomSearches = residentRoomSearches; }

    public String getEquipmentCondition() { return equipmentCondition; }
    public void setEquipmentCondition(String equipmentCondition) { this.equipmentCondition = equipmentCondition; }

    public LocalTime getAnnouncementTime() { return announcementTime; }
    public void setAnnouncementTime(LocalTime announcementTime) { this.announcementTime = announcementTime; }

    public String getAnnouncementStaff() { return announcementStaff; }
    public void setAnnouncementStaff(String announcementStaff) { this.announcementStaff = announcementStaff; }

    public String getAnnouncementAreas() { return announcementAreas; }
    public void setAnnouncementAreas(String announcementAreas) { this.announcementAreas = announcementAreas; }

    public String getAdditionalComments() { return additionalComments; }
    public void setAdditionalComments(String additionalComments) { this.additionalComments = additionalComments; }

    public String getReportCompletedBy() { return reportCompletedBy; }
    public void setReportCompletedBy(String reportCompletedBy) { this.reportCompletedBy = reportCompletedBy; }

    public String getReportCompletedByEmail() { return reportCompletedByEmail; }
    public void setReportCompletedByEmail(String reportCompletedByEmail) { this.reportCompletedByEmail = reportCompletedByEmail; }

    public LocalDateTime getSignatureDatetime() { return signatureDatetime; }
    public void setSignatureDatetime(LocalDateTime signatureDatetime) { this.signatureDatetime = signatureDatetime; }

    public Boolean getCertificationComplete() { return certificationComplete; }
    public void setCertificationComplete(Boolean certificationComplete) { this.certificationComplete = certificationComplete; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getContrabandFound() { return contrabandFound; }
    public void setContrabandFound(Boolean contrabandFound) { this.contrabandFound = contrabandFound; }

    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}

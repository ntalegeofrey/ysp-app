package app.ysp.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "repair_interventions")
public class RepairIntervention {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id")
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    private ProgramResident resident;

    @Column(name = "infraction_date")
    private LocalDate infractionDate;

    @Column(name = "infraction_shift")
    private String infractionShift; // 1st Shift, 2nd Shift, 3rd Shift

    @Column(name = "infraction_behavior")
    private String infractionBehavior;

    @Column(name = "assigning_staff_id")
    private Long assigningStaffId;

    @Column(name = "assigning_staff_name")
    private String assigningStaffName;

    @Column(name = "repair_level")
    private String repairLevel; // Repair 1, Repair 2, Repair 3

    @Column(name = "interventions_json", columnDefinition = "TEXT")
    private String interventionsJson; // JSON array of selected interventions

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "review_date")
    private LocalDate reviewDate;

    @Column(name = "reviewed_by_pd_id")
    private Long reviewedByPdId;

    @Column(name = "reviewed_by_pd_name")
    private String reviewedByPdName;

    @Column(name = "reviewed_by_pd_at")
    private Instant reviewedByPdAt;

    @Column(name = "reviewed_by_clinical_id")
    private Long reviewedByClinicalId;

    @Column(name = "reviewed_by_clinical_name")
    private String reviewedByClinicalName;

    @Column(name = "reviewed_by_clinical_at")
    private Instant reviewedByClinicalAt;

    @Column(name = "repair_duration_days")
    private Integer repairDurationDays;

    @Column(name = "repair_start_date")
    private LocalDate repairStartDate;

    @Column(name = "repair_end_date")
    private LocalDate repairEndDate;

    @Column(name = "points_suspended")
    private Boolean pointsSuspended = true;

    @Column(name = "pd_review_status")
    private String pdReviewStatus = "pending"; // pending, approved, disapproved

    @Column(name = "pd_review_comments", columnDefinition = "TEXT")
    private String pdReviewComments;

    @Column(name = "clinical_review_status")
    private String clinicalReviewStatus = "pending"; // pending, approved, disapproved

    @Column(name = "clinical_review_comments", columnDefinition = "TEXT")
    private String clinicalReviewComments;

    @Column(name = "status")
    private String status; // draft, pending_review, approved, completed

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public ProgramResident getResident() { return resident; }
    public void setResident(ProgramResident resident) { this.resident = resident; }

    public LocalDate getInfractionDate() { return infractionDate; }
    public void setInfractionDate(LocalDate infractionDate) { this.infractionDate = infractionDate; }

    public String getInfractionShift() { return infractionShift; }
    public void setInfractionShift(String infractionShift) { this.infractionShift = infractionShift; }

    public String getInfractionBehavior() { return infractionBehavior; }
    public void setInfractionBehavior(String infractionBehavior) { this.infractionBehavior = infractionBehavior; }

    public Long getAssigningStaffId() { return assigningStaffId; }
    public void setAssigningStaffId(Long assigningStaffId) { this.assigningStaffId = assigningStaffId; }

    public String getAssigningStaffName() { return assigningStaffName; }
    public void setAssigningStaffName(String assigningStaffName) { this.assigningStaffName = assigningStaffName; }

    public String getRepairLevel() { return repairLevel; }
    public void setRepairLevel(String repairLevel) { this.repairLevel = repairLevel; }

    public String getInterventionsJson() { return interventionsJson; }
    public void setInterventionsJson(String interventionsJson) { this.interventionsJson = interventionsJson; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }

    public Long getReviewedByPdId() { return reviewedByPdId; }
    public void setReviewedByPdId(Long reviewedByPdId) { this.reviewedByPdId = reviewedByPdId; }

    public String getReviewedByPdName() { return reviewedByPdName; }
    public void setReviewedByPdName(String reviewedByPdName) { this.reviewedByPdName = reviewedByPdName; }

    public Instant getReviewedByPdAt() { return reviewedByPdAt; }
    public void setReviewedByPdAt(Instant reviewedByPdAt) { this.reviewedByPdAt = reviewedByPdAt; }

    public Long getReviewedByClinicalId() { return reviewedByClinicalId; }
    public void setReviewedByClinicalId(Long reviewedByClinicalId) { this.reviewedByClinicalId = reviewedByClinicalId; }

    public String getReviewedByClinicalName() { return reviewedByClinicalName; }
    public void setReviewedByClinicalName(String reviewedByClinicalName) { this.reviewedByClinicalName = reviewedByClinicalName; }

    public Instant getReviewedByClinicalAt() { return reviewedByClinicalAt; }
    public void setReviewedByClinicalAt(Instant reviewedByClinicalAt) { this.reviewedByClinicalAt = reviewedByClinicalAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public Integer getRepairDurationDays() { return repairDurationDays; }
    public void setRepairDurationDays(Integer repairDurationDays) { this.repairDurationDays = repairDurationDays; }

    public LocalDate getRepairStartDate() { return repairStartDate; }
    public void setRepairStartDate(LocalDate repairStartDate) { this.repairStartDate = repairStartDate; }

    public LocalDate getRepairEndDate() { return repairEndDate; }
    public void setRepairEndDate(LocalDate repairEndDate) { this.repairEndDate = repairEndDate; }

    public Boolean getPointsSuspended() { return pointsSuspended; }
    public void setPointsSuspended(Boolean pointsSuspended) { this.pointsSuspended = pointsSuspended; }

    public String getPdReviewStatus() { return pdReviewStatus; }
    public void setPdReviewStatus(String pdReviewStatus) { this.pdReviewStatus = pdReviewStatus; }

    public String getPdReviewComments() { return pdReviewComments; }
    public void setPdReviewComments(String pdReviewComments) { this.pdReviewComments = pdReviewComments; }

    public String getClinicalReviewStatus() { return clinicalReviewStatus; }
    public void setClinicalReviewStatus(String clinicalReviewStatus) { this.clinicalReviewStatus = clinicalReviewStatus; }

    public String getClinicalReviewComments() { return clinicalReviewComments; }
    public void setClinicalReviewComments(String clinicalReviewComments) { this.clinicalReviewComments = clinicalReviewComments; }
}

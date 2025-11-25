package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;

public class RepairInterventionResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private LocalDate infractionDate;
    private String infractionShift;
    private String infractionBehavior;
    private Long assigningStaffId;
    private String assigningStaffName;
    private String repairLevel;
    private String interventionsJson;
    private String comments;
    private LocalDate reviewDate;
    private Long reviewedByPdId;
    private String reviewedByPdName;
    private Instant reviewedByPdAt;
    private Long reviewedByClinicalId;
    private String reviewedByClinicalName;
    private Instant reviewedByClinicalAt;
    private Integer repairDurationDays;
    private LocalDate repairStartDate;
    private LocalDate repairEndDate;
    private Boolean pointsSuspended;
    private String pdReviewStatus;
    private String pdReviewComments;
    private String clinicalReviewStatus;
    private String clinicalReviewComments;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProgramId() { return programId; }
    public void setProgramId(Long programId) { this.programId = programId; }

    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }

    public String getResidentNumber() { return residentNumber; }
    public void setResidentNumber(String residentNumber) { this.residentNumber = residentNumber; }

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

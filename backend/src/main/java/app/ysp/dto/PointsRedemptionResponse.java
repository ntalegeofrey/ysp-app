package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;

public class PointsRedemptionResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private Long diaryCardId;
    private LocalDate redemptionDate;
    private Integer pointsRedeemed;
    private String rewardItem;
    private Boolean customItem;
    private Long approvedByStaffId;
    private String approvedByStaffName;
    private Instant approvedAt;
    private String approvalStatus;
    private String approvalComments;
    private Instant createdAt;
    private Instant updatedAt;

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

    public Long getDiaryCardId() { return diaryCardId; }
    public void setDiaryCardId(Long diaryCardId) { this.diaryCardId = diaryCardId; }

    public LocalDate getRedemptionDate() { return redemptionDate; }
    public void setRedemptionDate(LocalDate redemptionDate) { this.redemptionDate = redemptionDate; }

    public Integer getPointsRedeemed() { return pointsRedeemed; }
    public void setPointsRedeemed(Integer pointsRedeemed) { this.pointsRedeemed = pointsRedeemed; }

    public String getRewardItem() { return rewardItem; }
    public void setRewardItem(String rewardItem) { this.rewardItem = rewardItem; }

    public Boolean getCustomItem() { return customItem; }
    public void setCustomItem(Boolean customItem) { this.customItem = customItem; }

    public Long getApprovedByStaffId() { return approvedByStaffId; }
    public void setApprovedByStaffId(Long approvedByStaffId) { this.approvedByStaffId = approvedByStaffId; }

    public String getApprovedByStaffName() { return approvedByStaffName; }
    public void setApprovedByStaffName(String approvedByStaffName) { this.approvedByStaffName = approvedByStaffName; }

    public Instant getApprovedAt() { return approvedAt; }
    public void setApprovedAt(Instant approvedAt) { this.approvedAt = approvedAt; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public String getApprovalComments() { return approvalComments; }
    public void setApprovalComments(String approvalComments) { this.approvalComments = approvalComments; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

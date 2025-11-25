package app.ysp.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "points_redemptions")
public class PointsRedemption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_card_id")
    private PointsDiaryCard diaryCard;

    @Column(name = "redemption_date", nullable = false)
    private LocalDate redemptionDate;

    @Column(name = "points_redeemed", nullable = false)
    private Integer pointsRedeemed;

    @Column(name = "reward_item", nullable = false)
    private String rewardItem;

    @Column(name = "custom_item")
    private Boolean customItem = false;

    @Column(name = "approved_by_staff_id")
    private Long approvedByStaffId;

    @Column(name = "approved_by_staff_name")
    private String approvedByStaffName;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "approval_status")
    private String approvalStatus = "pending"; // pending, approved, rejected

    @Column(name = "approval_comments", columnDefinition = "TEXT")
    private String approvalComments;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public ProgramResident getResident() { return resident; }
    public void setResident(ProgramResident resident) { this.resident = resident; }

    public PointsDiaryCard getDiaryCard() { return diaryCard; }
    public void setDiaryCard(PointsDiaryCard diaryCard) { this.diaryCard = diaryCard; }

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

package app.ysp.dto;

import java.time.LocalDate;

public class PointsRedemptionRequest {
    private Long residentId;
    private LocalDate redemptionDate;
    private Integer pointsRedeemed;
    private String rewardItem;
    private Boolean customItem;

    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public LocalDate getRedemptionDate() { return redemptionDate; }
    public void setRedemptionDate(LocalDate redemptionDate) { this.redemptionDate = redemptionDate; }

    public Integer getPointsRedeemed() { return pointsRedeemed; }
    public void setPointsRedeemed(Integer pointsRedeemed) { this.pointsRedeemed = pointsRedeemed; }

    public String getRewardItem() { return rewardItem; }
    public void setRewardItem(String rewardItem) { this.rewardItem = rewardItem; }

    public Boolean getCustomItem() { return customItem; }
    public void setCustomItem(Boolean customItem) { this.customItem = customItem; }
}

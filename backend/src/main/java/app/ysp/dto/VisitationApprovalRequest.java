package app.ysp.dto;

public class VisitationApprovalRequest {
    private String approvalStatus; // APPROVED, PENDING, DENIED
    private String denialReason;

    // Getters and Setters
    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getDenialReason() {
        return denialReason;
    }

    public void setDenialReason(String denialReason) {
        this.denialReason = denialReason;
    }
}

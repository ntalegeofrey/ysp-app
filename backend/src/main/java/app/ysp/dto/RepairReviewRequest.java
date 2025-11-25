package app.ysp.dto;

public class RepairReviewRequest {
    private String reviewStatus; // approved or disapproved
    private String reviewComments;

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public String getReviewComments() { return reviewComments; }
    public void setReviewComments(String reviewComments) { this.reviewComments = reviewComments; }
}

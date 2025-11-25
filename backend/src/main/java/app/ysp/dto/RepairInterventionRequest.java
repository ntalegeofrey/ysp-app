package app.ysp.dto;

import java.time.LocalDate;

public class RepairInterventionRequest {
    private Long residentId;
    private LocalDate infractionDate;
    private String infractionShift;
    private String infractionBehavior;
    private String repairLevel;
    private String interventionsJson;
    private String comments;
    private LocalDate reviewDate;

    // Getters and Setters
    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public LocalDate getInfractionDate() { return infractionDate; }
    public void setInfractionDate(LocalDate infractionDate) { this.infractionDate = infractionDate; }

    public String getInfractionShift() { return infractionShift; }
    public void setInfractionShift(String infractionShift) { this.infractionShift = infractionShift; }

    public String getInfractionBehavior() { return infractionBehavior; }
    public void setInfractionBehavior(String infractionBehavior) { this.infractionBehavior = infractionBehavior; }

    public String getRepairLevel() { return repairLevel; }
    public void setRepairLevel(String repairLevel) { this.repairLevel = repairLevel; }

    public String getInterventionsJson() { return interventionsJson; }
    public void setInterventionsJson(String interventionsJson) { this.interventionsJson = interventionsJson; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }
}

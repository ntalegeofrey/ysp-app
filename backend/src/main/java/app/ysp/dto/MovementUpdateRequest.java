package app.ysp.dto;

public class MovementUpdateRequest {
    private String status;
    private String outcomeNotes;
    private String actualDuration;
    
    // Getters and Setters
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getOutcomeNotes() {
        return outcomeNotes;
    }
    
    public void setOutcomeNotes(String outcomeNotes) {
        this.outcomeNotes = outcomeNotes;
    }
    
    public String getActualDuration() {
        return actualDuration;
    }
    
    public void setActualDuration(String actualDuration) {
        this.actualDuration = actualDuration;
    }
}

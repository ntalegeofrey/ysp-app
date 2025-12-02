package app.ysp.dto;

import java.time.Instant;

public class EndWatchRequest {
    private Instant endDateTime;
    private String status; // COMPLETED, ESCALATED, TRANSFERRED, DISCONTINUED
    private String outcome;
    private String endNotes;

    // Getters and Setters
    public Instant getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(Instant endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getEndNotes() {
        return endNotes;
    }

    public void setEndNotes(String endNotes) {
        this.endNotes = endNotes;
    }
}

package app.ysp.dto;

import java.time.Instant;

public class WatchLogEntryRequest {
    private Instant observationTime;
    private String observationStatus; // NORMAL, HIGH, CRITICAL
    private String activity; // SLEEPING, LAYING_ON_BED, WALKING, PLAYING, ENGAGING, BATHROOM, OTHER
    private String notes;

    // Getters and Setters
    public Instant getObservationTime() {
        return observationTime;
    }

    public void setObservationTime(Instant observationTime) {
        this.observationTime = observationTime;
    }

    public String getObservationStatus() {
        return observationStatus;
    }

    public void setObservationStatus(String observationStatus) {
        this.observationStatus = observationStatus;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

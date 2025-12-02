package app.ysp.dto;

import java.time.Instant;

public class WatchLogEntryResponse {
    private Long id;
    private Long watchAssignmentId;
    private Instant observationTime;
    private String observationStatus;
    private String activity;
    private String notes;
    private Long loggedByStaffId;
    private String loggedByStaffName;
    private Instant createdAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWatchAssignmentId() {
        return watchAssignmentId;
    }

    public void setWatchAssignmentId(Long watchAssignmentId) {
        this.watchAssignmentId = watchAssignmentId;
    }

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

    public Long getLoggedByStaffId() {
        return loggedByStaffId;
    }

    public void setLoggedByStaffId(Long loggedByStaffId) {
        this.loggedByStaffId = loggedByStaffId;
    }

    public String getLoggedByStaffName() {
        return loggedByStaffName;
    }

    public void setLoggedByStaffName(String loggedByStaffName) {
        this.loggedByStaffName = loggedByStaffName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

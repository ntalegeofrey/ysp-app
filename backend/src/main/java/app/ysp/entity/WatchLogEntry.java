package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "watch_log_entries")
public class WatchLogEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "watch_assignment_id", nullable = false)
    private WatchAssignment watchAssignment;

    @Column(name = "observation_time", nullable = false)
    private Instant observationTime;

    @Column(name = "observation_status", nullable = false, length = 50)
    private String observationStatus; // NORMAL, HIGH, CRITICAL

    @Column(name = "activity", nullable = false, length = 50)
    private String activity; // SLEEPING, LAYING_ON_BED, WALKING, PLAYING, ENGAGING, BATHROOM, OTHER

    @Column(name = "notes", nullable = false, columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "logged_by_staff_id", nullable = false)
    private User loggedByStaff;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WatchAssignment getWatchAssignment() {
        return watchAssignment;
    }

    public void setWatchAssignment(WatchAssignment watchAssignment) {
        this.watchAssignment = watchAssignment;
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

    public User getLoggedByStaff() {
        return loggedByStaff;
    }

    public void setLoggedByStaff(User loggedByStaff) {
        this.loggedByStaff = loggedByStaff;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

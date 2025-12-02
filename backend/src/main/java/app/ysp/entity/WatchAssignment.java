package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "watch_assignments")
public class WatchAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "watch_type", nullable = false, length = 50)
    private String watchType; // ELEVATED, ALERT, GENERAL

    @Column(name = "start_date_time", nullable = false)
    private Instant startDateTime;

    @Column(name = "end_date_time")
    private Instant endDateTime;

    @Column(name = "clinical_reason", nullable = false, columnDefinition = "TEXT")
    private String clinicalReason;

    // Risk assessment flags
    @Column(name = "self_harm_risk", nullable = false)
    private Boolean selfHarmRisk = false;

    @Column(name = "suicidal_ideation", nullable = false)
    private Boolean suicidalIdeation = false;

    @Column(name = "aggressive_behavior", nullable = false)
    private Boolean aggressiveBehavior = false;

    @Column(name = "sleep_disturbance", nullable = false)
    private Boolean sleepDisturbance = false;

    @Column(name = "medical_concern", nullable = false)
    private Boolean medicalConcern = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorized_by_clinician_id", nullable = false)
    private User authorizedByClinician;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, ESCALATED, TRANSFERRED, DISCONTINUED

    @Column(name = "outcome", columnDefinition = "TEXT")
    private String outcome;

    @Column(name = "end_notes", columnDefinition = "TEXT")
    private String endNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ended_by_staff_id")
    private User endedByStaff;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProgramResident getResident() {
        return resident;
    }

    public void setResident(ProgramResident resident) {
        this.resident = resident;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public String getWatchType() {
        return watchType;
    }

    public void setWatchType(String watchType) {
        this.watchType = watchType;
    }

    public Instant getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(Instant startDateTime) {
        this.startDateTime = startDateTime;
    }

    public Instant getEndDateTime() {
        return endDateTime;
    }

    public void setEndDateTime(Instant endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getClinicalReason() {
        return clinicalReason;
    }

    public void setClinicalReason(String clinicalReason) {
        this.clinicalReason = clinicalReason;
    }

    public Boolean getSelfHarmRisk() {
        return selfHarmRisk;
    }

    public void setSelfHarmRisk(Boolean selfHarmRisk) {
        this.selfHarmRisk = selfHarmRisk;
    }

    public Boolean getSuicidalIdeation() {
        return suicidalIdeation;
    }

    public void setSuicidalIdeation(Boolean suicidalIdeation) {
        this.suicidalIdeation = suicidalIdeation;
    }

    public Boolean getAggressiveBehavior() {
        return aggressiveBehavior;
    }

    public void setAggressiveBehavior(Boolean aggressiveBehavior) {
        this.aggressiveBehavior = aggressiveBehavior;
    }

    public Boolean getSleepDisturbance() {
        return sleepDisturbance;
    }

    public void setSleepDisturbance(Boolean sleepDisturbance) {
        this.sleepDisturbance = sleepDisturbance;
    }

    public Boolean getMedicalConcern() {
        return medicalConcern;
    }

    public void setMedicalConcern(Boolean medicalConcern) {
        this.medicalConcern = medicalConcern;
    }

    public User getAuthorizedByClinician() {
        return authorizedByClinician;
    }

    public void setAuthorizedByClinician(User authorizedByClinician) {
        this.authorizedByClinician = authorizedByClinician;
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

    public User getEndedByStaff() {
        return endedByStaff;
    }

    public void setEndedByStaff(User endedByStaff) {
        this.endedByStaff = endedByStaff;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}

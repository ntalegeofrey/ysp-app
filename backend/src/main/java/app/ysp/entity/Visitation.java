package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "visitations")
public class Visitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @Column(name = "visit_type", nullable = false, length = 50)
    private String visitType; // IN_PERSON, VIDEO, PROFESSIONAL, LEGAL

    @Column(name = "status", nullable = false, length = 50)
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

    @Column(name = "approval_status", nullable = false, length = 50)
    private String approvalStatus = "PENDING"; // APPROVED, PENDING, DENIED

    @Column(name = "visitor_info_json", columnDefinition = "TEXT")
    private String visitorInfoJson; // JSON array: [{name, relationship, phone, email}, ...]

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "scheduled_start_time", nullable = false)
    private Instant scheduledStartTime;

    @Column(name = "scheduled_end_time", nullable = false)
    private Instant scheduledEndTime;

    @Column(name = "actual_start_time")
    private Instant actualStartTime;

    @Column(name = "actual_end_time")
    private Instant actualEndTime;

    @Column(name = "visitation_room", length = 100)
    private String visitationRoom;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supervising_staff_id")
    private User supervisingStaff;

    @Column(name = "visit_notes", columnDefinition = "TEXT")
    private String visitNotes;

    @Column(name = "denial_reason", columnDefinition = "TEXT")
    private String denialReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheduled_by_staff_id")
    private User scheduledByStaff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "completed_by_staff_id")
    private User completedByStaff;

    @Column(name = "incident_occurred")
    private Boolean incidentOccurred = false;

    @Column(name = "incident_details", columnDefinition = "TEXT")
    private String incidentDetails;

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

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public ProgramResident getResident() {
        return resident;
    }

    public void setResident(ProgramResident resident) {
        this.resident = resident;
    }

    public String getVisitType() {
        return visitType;
    }

    public void setVisitType(String visitType) {
        this.visitType = visitType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getVisitorInfoJson() {
        return visitorInfoJson;
    }

    public void setVisitorInfoJson(String visitorInfoJson) {
        this.visitorInfoJson = visitorInfoJson;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Instant getScheduledStartTime() {
        return scheduledStartTime;
    }

    public void setScheduledStartTime(Instant scheduledStartTime) {
        this.scheduledStartTime = scheduledStartTime;
    }

    public Instant getScheduledEndTime() {
        return scheduledEndTime;
    }

    public void setScheduledEndTime(Instant scheduledEndTime) {
        this.scheduledEndTime = scheduledEndTime;
    }

    public Instant getActualStartTime() {
        return actualStartTime;
    }

    public void setActualStartTime(Instant actualStartTime) {
        this.actualStartTime = actualStartTime;
    }

    public Instant getActualEndTime() {
        return actualEndTime;
    }

    public void setActualEndTime(Instant actualEndTime) {
        this.actualEndTime = actualEndTime;
    }

    public String getVisitationRoom() {
        return visitationRoom;
    }

    public void setVisitationRoom(String visitationRoom) {
        this.visitationRoom = visitationRoom;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public User getSupervisingStaff() {
        return supervisingStaff;
    }

    public void setSupervisingStaff(User supervisingStaff) {
        this.supervisingStaff = supervisingStaff;
    }

    public String getVisitNotes() {
        return visitNotes;
    }

    public void setVisitNotes(String visitNotes) {
        this.visitNotes = visitNotes;
    }

    public String getDenialReason() {
        return denialReason;
    }

    public void setDenialReason(String denialReason) {
        this.denialReason = denialReason;
    }

    public User getScheduledByStaff() {
        return scheduledByStaff;
    }

    public void setScheduledByStaff(User scheduledByStaff) {
        this.scheduledByStaff = scheduledByStaff;
    }

    public User getCompletedByStaff() {
        return completedByStaff;
    }

    public void setCompletedByStaff(User completedByStaff) {
        this.completedByStaff = completedByStaff;
    }

    public Boolean getIncidentOccurred() {
        return incidentOccurred;
    }

    public void setIncidentOccurred(Boolean incidentOccurred) {
        this.incidentOccurred = incidentOccurred;
    }

    public String getIncidentDetails() {
        return incidentDetails;
    }

    public void setIncidentDetails(String incidentDetails) {
        this.incidentDetails = incidentDetails;
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

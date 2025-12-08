package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "offsite_movements")
public class OffsiteMovement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;
    
    // Movement details
    @Column(name = "movement_type", nullable = false, length = 100)
    private String movementType;
    
    @Column(name = "movement_date", nullable = false)
    private LocalDate movementDate;
    
    @Column(name = "movement_time", nullable = false)
    private LocalTime movementTime;
    
    @Column(name = "destination", nullable = false)
    private String destination;
    
    @Column(name = "destination_address", columnDefinition = "TEXT")
    private String destinationAddress;
    
    @Column(name = "destination_contact")
    private String destinationContact;
    
    // Scheduling
    @Column(name = "estimated_duration", length = 50)
    private String estimatedDuration;
    
    @Column(name = "priority_level", nullable = false, length = 20)
    private String priorityLevel = "ROUTINE";
    
    @Column(name = "status", nullable = false, length = 20)
    private String status = "SCHEDULED";
    
    // Actual tracking
    @Column(name = "actual_start_time")
    private Instant actualStartTime;
    
    @Column(name = "actual_end_time")
    private Instant actualEndTime;
    
    @Column(name = "actual_duration", length = 50)
    private String actualDuration;
    
    // Security & special requirements
    @Column(name = "requires_restraints")
    private Boolean requiresRestraints = false;
    
    @Column(name = "wheelchair_accessible")
    private Boolean wheelchairAccessible = false;
    
    @Column(name = "medical_equipment_needed")
    private Boolean medicalEquipmentNeeded = false;
    
    @Column(name = "behavioral_precautions")
    private Boolean behavioralPrecautions = false;
    
    // Notes
    @Column(name = "movement_notes", columnDefinition = "TEXT")
    private String movementNotes;
    
    @Column(name = "outcome_notes", columnDefinition = "TEXT")
    private String outcomeNotes;
    
    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;
    
    // Audit fields
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheduled_by_staff_id", nullable = false)
    private User scheduledByStaff;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "completed_by_staff_id")
    private User completedByStaff;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cancelled_by_staff_id")
    private User cancelledByStaff;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    
    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
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
    
    public String getMovementType() {
        return movementType;
    }
    
    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }
    
    public LocalDate getMovementDate() {
        return movementDate;
    }
    
    public void setMovementDate(LocalDate movementDate) {
        this.movementDate = movementDate;
    }
    
    public LocalTime getMovementTime() {
        return movementTime;
    }
    
    public void setMovementTime(LocalTime movementTime) {
        this.movementTime = movementTime;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public String getDestinationAddress() {
        return destinationAddress;
    }
    
    public void setDestinationAddress(String destinationAddress) {
        this.destinationAddress = destinationAddress;
    }
    
    public String getDestinationContact() {
        return destinationContact;
    }
    
    public void setDestinationContact(String destinationContact) {
        this.destinationContact = destinationContact;
    }
    
    public String getEstimatedDuration() {
        return estimatedDuration;
    }
    
    public void setEstimatedDuration(String estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
    
    public String getPriorityLevel() {
        return priorityLevel;
    }
    
    public void setPriorityLevel(String priorityLevel) {
        this.priorityLevel = priorityLevel;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
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
    
    public String getActualDuration() {
        return actualDuration;
    }
    
    public void setActualDuration(String actualDuration) {
        this.actualDuration = actualDuration;
    }
    
    public Boolean getRequiresRestraints() {
        return requiresRestraints;
    }
    
    public void setRequiresRestraints(Boolean requiresRestraints) {
        this.requiresRestraints = requiresRestraints;
    }
    
    public Boolean getWheelchairAccessible() {
        return wheelchairAccessible;
    }
    
    public void setWheelchairAccessible(Boolean wheelchairAccessible) {
        this.wheelchairAccessible = wheelchairAccessible;
    }
    
    public Boolean getMedicalEquipmentNeeded() {
        return medicalEquipmentNeeded;
    }
    
    public void setMedicalEquipmentNeeded(Boolean medicalEquipmentNeeded) {
        this.medicalEquipmentNeeded = medicalEquipmentNeeded;
    }
    
    public Boolean getBehavioralPrecautions() {
        return behavioralPrecautions;
    }
    
    public void setBehavioralPrecautions(Boolean behavioralPrecautions) {
        this.behavioralPrecautions = behavioralPrecautions;
    }
    
    public String getMovementNotes() {
        return movementNotes;
    }
    
    public void setMovementNotes(String movementNotes) {
        this.movementNotes = movementNotes;
    }
    
    public String getOutcomeNotes() {
        return outcomeNotes;
    }
    
    public void setOutcomeNotes(String outcomeNotes) {
        this.outcomeNotes = outcomeNotes;
    }
    
    public String getCancellationReason() {
        return cancellationReason;
    }
    
    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
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
    
    public User getCancelledByStaff() {
        return cancelledByStaff;
    }
    
    public void setCancelledByStaff(User cancelledByStaff) {
        this.cancelledByStaff = cancelledByStaff;
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

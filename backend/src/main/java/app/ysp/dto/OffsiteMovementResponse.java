package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class OffsiteMovementResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private String movementType;
    private LocalDate movementDate;
    private LocalTime movementTime;
    private String destination;
    private String destinationAddress;
    private String destinationContact;
    private String estimatedDuration;
    private String priorityLevel;
    private String status;
    private Instant actualStartTime;
    private Instant actualEndTime;
    private String actualDuration;
    private Boolean requiresRestraints;
    private Boolean wheelchairAccessible;
    private Boolean medicalEquipmentNeeded;
    private Boolean behavioralPrecautions;
    private String movementNotes;
    private String outcomeNotes;
    private String cancellationReason;
    private Long scheduledByStaffId;
    private String scheduledByStaffName;
    private Long completedByStaffId;
    private String completedByStaffName;
    private Long cancelledByStaffId;
    private String cancelledByStaffName;
    private List<StaffAssignmentResponse> staffAssignments;
    private Instant createdAt;
    private Instant updatedAt;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getProgramId() {
        return programId;
    }
    
    public void setProgramId(Long programId) {
        this.programId = programId;
    }
    
    public Long getResidentId() {
        return residentId;
    }
    
    public void setResidentId(Long residentId) {
        this.residentId = residentId;
    }
    
    public String getResidentName() {
        return residentName;
    }
    
    public void setResidentName(String residentName) {
        this.residentName = residentName;
    }
    
    public String getResidentNumber() {
        return residentNumber;
    }
    
    public void setResidentNumber(String residentNumber) {
        this.residentNumber = residentNumber;
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
    
    public Long getScheduledByStaffId() {
        return scheduledByStaffId;
    }
    
    public void setScheduledByStaffId(Long scheduledByStaffId) {
        this.scheduledByStaffId = scheduledByStaffId;
    }
    
    public String getScheduledByStaffName() {
        return scheduledByStaffName;
    }
    
    public void setScheduledByStaffName(String scheduledByStaffName) {
        this.scheduledByStaffName = scheduledByStaffName;
    }
    
    public Long getCompletedByStaffId() {
        return completedByStaffId;
    }
    
    public void setCompletedByStaffId(Long completedByStaffId) {
        this.completedByStaffId = completedByStaffId;
    }
    
    public String getCompletedByStaffName() {
        return completedByStaffName;
    }
    
    public void setCompletedByStaffName(String completedByStaffName) {
        this.completedByStaffName = completedByStaffName;
    }
    
    public Long getCancelledByStaffId() {
        return cancelledByStaffId;
    }
    
    public void setCancelledByStaffId(Long cancelledByStaffId) {
        this.cancelledByStaffId = cancelledByStaffId;
    }
    
    public String getCancelledByStaffName() {
        return cancelledByStaffName;
    }
    
    public void setCancelledByStaffName(String cancelledByStaffName) {
        this.cancelledByStaffName = cancelledByStaffName;
    }
    
    public List<StaffAssignmentResponse> getStaffAssignments() {
        return staffAssignments;
    }
    
    public void setStaffAssignments(List<StaffAssignmentResponse> staffAssignments) {
        this.staffAssignments = staffAssignments;
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
    
    // Inner class for staff assignment response
    public static class StaffAssignmentResponse {
        private Long staffId;
        private String staffName;
        private String assignmentRole;
        private Instant assignedAt;
        
        public Long getStaffId() {
            return staffId;
        }
        
        public void setStaffId(Long staffId) {
            this.staffId = staffId;
        }
        
        public String getStaffName() {
            return staffName;
        }
        
        public void setStaffName(String staffName) {
            this.staffName = staffName;
        }
        
        public String getAssignmentRole() {
            return assignmentRole;
        }
        
        public void setAssignmentRole(String assignmentRole) {
            this.assignmentRole = assignmentRole;
        }
        
        public Instant getAssignedAt() {
            return assignedAt;
        }
        
        public void setAssignedAt(Instant assignedAt) {
            this.assignedAt = assignedAt;
        }
    }
}

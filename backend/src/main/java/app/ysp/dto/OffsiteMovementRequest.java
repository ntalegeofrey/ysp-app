package app.ysp.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class OffsiteMovementRequest {
    private Long residentId;
    private String movementType;
    private LocalDate movementDate;
    private LocalTime movementTime;
    private String destination;
    private String destinationAddress;
    private String destinationContact;
    private String estimatedDuration;
    private String priorityLevel;
    private Boolean requiresRestraints;
    private Boolean wheelchairAccessible;
    private Boolean medicalEquipmentNeeded;
    private Boolean behavioralPrecautions;
    private String movementNotes;
    private List<StaffAssignmentRequest> staffAssignments;
    
    // Getters and Setters
    public Long getResidentId() {
        return residentId;
    }
    
    public void setResidentId(Long residentId) {
        this.residentId = residentId;
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
    
    public List<StaffAssignmentRequest> getStaffAssignments() {
        return staffAssignments;
    }
    
    public void setStaffAssignments(List<StaffAssignmentRequest> staffAssignments) {
        this.staffAssignments = staffAssignments;
    }
    
    // Inner class for staff assignments
    public static class StaffAssignmentRequest {
        private Long staffId;
        private String assignmentRole;
        
        public Long getStaffId() {
            return staffId;
        }
        
        public void setStaffId(Long staffId) {
            this.staffId = staffId;
        }
        
        public String getAssignmentRole() {
            return assignmentRole;
        }
        
        public void setAssignmentRole(String assignmentRole) {
            this.assignmentRole = assignmentRole;
        }
    }
}

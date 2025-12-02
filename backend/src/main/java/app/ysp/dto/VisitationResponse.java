package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class VisitationResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private String visitType;
    private String status;
    private String approvalStatus;
    private List<VisitorInfo> visitorInfo;
    private LocalDate scheduledDate;
    private Instant scheduledStartTime;
    private Instant scheduledEndTime;
    private Instant actualStartTime;
    private Instant actualEndTime;
    private String visitationRoom;
    private String specialInstructions;
    
    // Staff information
    private Long supervisingStaffId;
    private String supervisingStaffName;
    private Long scheduledByStaffId;
    private String scheduledByStaffName;
    private Long completedByStaffId;
    private String completedByStaffName;
    
    // Notes and incidents
    private String visitNotes;
    private String denialReason;
    private Boolean incidentOccurred;
    private String incidentDetails;
    
    // Timestamps
    private Instant createdAt;
    private Instant updatedAt;
    
    // Computed fields
    private String duration; // Computed duration string

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

    public List<VisitorInfo> getVisitorInfo() {
        return visitorInfo;
    }

    public void setVisitorInfo(List<VisitorInfo> visitorInfo) {
        this.visitorInfo = visitorInfo;
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

    public Long getSupervisingStaffId() {
        return supervisingStaffId;
    }

    public void setSupervisingStaffId(Long supervisingStaffId) {
        this.supervisingStaffId = supervisingStaffId;
    }

    public String getSupervisingStaffName() {
        return supervisingStaffName;
    }

    public void setSupervisingStaffName(String supervisingStaffName) {
        this.supervisingStaffName = supervisingStaffName;
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

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}

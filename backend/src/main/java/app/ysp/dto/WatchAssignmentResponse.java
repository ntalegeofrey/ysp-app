package app.ysp.dto;

import java.time.Instant;

public class WatchAssignmentResponse {
    private Long id;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private String room;
    private Long programId;
    private String watchType;
    private Instant startDateTime;
    private Instant endDateTime;
    private String clinicalReason;
    
    // Risk assessment flags
    private Boolean selfHarmRisk;
    private Boolean suicidalIdeation;
    private Boolean aggressiveBehavior;
    private Boolean sleepDisturbance;
    private Boolean medicalConcern;
    
    // Authorization and completion
    private Long authorizedByClinicianId;
    private String authorizedByClinicianName;
    private String status;
    private String outcome;
    private String endNotes;
    private Long endedByStaffId;
    private String endedByStaffName;
    
    private Instant createdAt;
    private Instant updatedAt;
    
    // Additional computed fields
    private Long totalLogEntries;
    private String duration; // Computed duration string

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
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

    public Long getAuthorizedByClinicianId() {
        return authorizedByClinicianId;
    }

    public void setAuthorizedByClinicianId(Long authorizedByClinicianId) {
        this.authorizedByClinicianId = authorizedByClinicianId;
    }

    public String getAuthorizedByClinicianName() {
        return authorizedByClinicianName;
    }

    public void setAuthorizedByClinicianName(String authorizedByClinicianName) {
        this.authorizedByClinicianName = authorizedByClinicianName;
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

    public Long getEndedByStaffId() {
        return endedByStaffId;
    }

    public void setEndedByStaffId(Long endedByStaffId) {
        this.endedByStaffId = endedByStaffId;
    }

    public String getEndedByStaffName() {
        return endedByStaffName;
    }

    public void setEndedByStaffName(String endedByStaffName) {
        this.endedByStaffName = endedByStaffName;
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

    public Long getTotalLogEntries() {
        return totalLogEntries;
    }

    public void setTotalLogEntries(Long totalLogEntries) {
        this.totalLogEntries = totalLogEntries;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}

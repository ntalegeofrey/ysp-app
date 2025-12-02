package app.ysp.dto;

import java.time.Instant;

public class WatchAssignmentRequest {
    private Long residentId;
    private String watchType; // ELEVATED, ALERT, GENERAL
    private Instant startDateTime;
    private String clinicalReason;
    
    // Risk assessment flags
    private Boolean selfHarmRisk;
    private Boolean suicidalIdeation;
    private Boolean aggressiveBehavior;
    private Boolean sleepDisturbance;
    private Boolean medicalConcern;

    // Getters and Setters
    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
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
}

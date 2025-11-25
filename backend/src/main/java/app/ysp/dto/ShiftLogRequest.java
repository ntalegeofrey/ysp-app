package app.ysp.dto;

import java.time.LocalDate;

public class ShiftLogRequest {
    private LocalDate shiftDate;
    private String shiftType;
    private String unitSupervisor;
    private String residentInitials;
    private Integer residentCount;
    private String residentComments;
    private String incidentsEvents;
    private String overallStatus;
    private String followUpRequired;
    private String shiftSummary;
    private String staffAssignmentsJson;
    private String equipmentCountsJson;
    private Boolean certificationComplete;
    private Boolean certEquipmentVerified;
    private Boolean certShiftEventsAccurate;
    private String certificationDatetime; // Will be parsed to Instant
    private String reportCompletedBy;
    private String reportCompletedByEmail;
    
    // Getters and Setters
    public LocalDate getShiftDate() {
        return shiftDate;
    }
    
    public void setShiftDate(LocalDate shiftDate) {
        this.shiftDate = shiftDate;
    }
    
    public String getShiftType() {
        return shiftType;
    }
    
    public void setShiftType(String shiftType) {
        this.shiftType = shiftType;
    }
    
    public String getUnitSupervisor() {
        return unitSupervisor;
    }
    
    public void setUnitSupervisor(String unitSupervisor) {
        this.unitSupervisor = unitSupervisor;
    }
    
    public String getResidentInitials() {
        return residentInitials;
    }
    
    public void setResidentInitials(String residentInitials) {
        this.residentInitials = residentInitials;
    }
    
    public Integer getResidentCount() {
        return residentCount;
    }
    
    public void setResidentCount(Integer residentCount) {
        this.residentCount = residentCount;
    }
    
    public String getResidentComments() {
        return residentComments;
    }
    
    public void setResidentComments(String residentComments) {
        this.residentComments = residentComments;
    }
    
    public String getIncidentsEvents() {
        return incidentsEvents;
    }
    
    public void setIncidentsEvents(String incidentsEvents) {
        this.incidentsEvents = incidentsEvents;
    }
    
    public String getOverallStatus() {
        return overallStatus;
    }
    
    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }
    
    public String getFollowUpRequired() {
        return followUpRequired;
    }
    
    public void setFollowUpRequired(String followUpRequired) {
        this.followUpRequired = followUpRequired;
    }
    
    public String getShiftSummary() {
        return shiftSummary;
    }
    
    public void setShiftSummary(String shiftSummary) {
        this.shiftSummary = shiftSummary;
    }
    
    public String getStaffAssignmentsJson() {
        return staffAssignmentsJson;
    }
    
    public void setStaffAssignmentsJson(String staffAssignmentsJson) {
        this.staffAssignmentsJson = staffAssignmentsJson;
    }
    
    public String getEquipmentCountsJson() {
        return equipmentCountsJson;
    }
    
    public void setEquipmentCountsJson(String equipmentCountsJson) {
        this.equipmentCountsJson = equipmentCountsJson;
    }
    
    public Boolean getCertificationComplete() {
        return certificationComplete;
    }
    
    public void setCertificationComplete(Boolean certificationComplete) {
        this.certificationComplete = certificationComplete;
    }
    
    public Boolean getCertEquipmentVerified() {
        return certEquipmentVerified;
    }
    
    public void setCertEquipmentVerified(Boolean certEquipmentVerified) {
        this.certEquipmentVerified = certEquipmentVerified;
    }
    
    public Boolean getCertShiftEventsAccurate() {
        return certShiftEventsAccurate;
    }
    
    public void setCertShiftEventsAccurate(Boolean certShiftEventsAccurate) {
        this.certShiftEventsAccurate = certShiftEventsAccurate;
    }
    
    public String getCertificationDatetime() {
        return certificationDatetime;
    }
    
    public void setCertificationDatetime(String certificationDatetime) {
        this.certificationDatetime = certificationDatetime;
    }
    
    public String getReportCompletedBy() {
        return reportCompletedBy;
    }
    
    public void setReportCompletedBy(String reportCompletedBy) {
        this.reportCompletedBy = reportCompletedBy;
    }
    
    public String getReportCompletedByEmail() {
        return reportCompletedByEmail;
    }
    
    public void setReportCompletedByEmail(String reportCompletedByEmail) {
        this.reportCompletedByEmail = reportCompletedByEmail;
    }
}

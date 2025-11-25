package app.ysp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class IncidentReportRequest {
    private LocalDate incidentDate;
    private LocalTime incidentTime;
    private String shift;
    private String areaOfIncident;
    private String natureOfIncident;
    private String residentsInvolved;
    private String staffInvolved;
    private String residentWitnesses;
    private String primaryStaffRestraint;
    private LocalTime mechanicalsStartTime;
    private LocalTime mechanicalsFinishTime;
    private LocalTime roomConfinementStartTime;
    private LocalTime roomConfinementFinishTime;
    private Integer staffPopulation;
    private Integer youthPopulation;
    private String detailedDescription;
    private String reportCompletedBy;
    private String reportCompletedByEmail;
    private LocalDateTime signatureDatetime;
    private Boolean certificationComplete;
    private Long createdBy;

    // Getters and Setters
    public LocalDate getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDate incidentDate) { this.incidentDate = incidentDate; }

    public LocalTime getIncidentTime() { return incidentTime; }
    public void setIncidentTime(LocalTime incidentTime) { this.incidentTime = incidentTime; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getAreaOfIncident() { return areaOfIncident; }
    public void setAreaOfIncident(String areaOfIncident) { this.areaOfIncident = areaOfIncident; }

    public String getNatureOfIncident() { return natureOfIncident; }
    public void setNatureOfIncident(String natureOfIncident) { this.natureOfIncident = natureOfIncident; }

    public String getResidentsInvolved() { return residentsInvolved; }
    public void setResidentsInvolved(String residentsInvolved) { this.residentsInvolved = residentsInvolved; }

    public String getStaffInvolved() { return staffInvolved; }
    public void setStaffInvolved(String staffInvolved) { this.staffInvolved = staffInvolved; }

    public String getResidentWitnesses() { return residentWitnesses; }
    public void setResidentWitnesses(String residentWitnesses) { this.residentWitnesses = residentWitnesses; }

    public String getPrimaryStaffRestraint() { return primaryStaffRestraint; }
    public void setPrimaryStaffRestraint(String primaryStaffRestraint) { this.primaryStaffRestraint = primaryStaffRestraint; }

    public LocalTime getMechanicalsStartTime() { return mechanicalsStartTime; }
    public void setMechanicalsStartTime(LocalTime mechanicalsStartTime) { this.mechanicalsStartTime = mechanicalsStartTime; }

    public LocalTime getMechanicalsFinishTime() { return mechanicalsFinishTime; }
    public void setMechanicalsFinishTime(LocalTime mechanicalsFinishTime) { this.mechanicalsFinishTime = mechanicalsFinishTime; }

    public LocalTime getRoomConfinementStartTime() { return roomConfinementStartTime; }
    public void setRoomConfinementStartTime(LocalTime roomConfinementStartTime) { this.roomConfinementStartTime = roomConfinementStartTime; }

    public LocalTime getRoomConfinementFinishTime() { return roomConfinementFinishTime; }
    public void setRoomConfinementFinishTime(LocalTime roomConfinementFinishTime) { this.roomConfinementFinishTime = roomConfinementFinishTime; }

    public Integer getStaffPopulation() { return staffPopulation; }
    public void setStaffPopulation(Integer staffPopulation) { this.staffPopulation = staffPopulation; }

    public Integer getYouthPopulation() { return youthPopulation; }
    public void setYouthPopulation(Integer youthPopulation) { this.youthPopulation = youthPopulation; }

    public String getDetailedDescription() { return detailedDescription; }
    public void setDetailedDescription(String detailedDescription) { this.detailedDescription = detailedDescription; }

    public String getReportCompletedBy() { return reportCompletedBy; }
    public void setReportCompletedBy(String reportCompletedBy) { this.reportCompletedBy = reportCompletedBy; }

    public String getReportCompletedByEmail() { return reportCompletedByEmail; }
    public void setReportCompletedByEmail(String reportCompletedByEmail) { this.reportCompletedByEmail = reportCompletedByEmail; }

    public LocalDateTime getSignatureDatetime() { return signatureDatetime; }
    public void setSignatureDatetime(LocalDateTime signatureDatetime) { this.signatureDatetime = signatureDatetime; }

    public Boolean getCertificationComplete() { return certificationComplete; }
    public void setCertificationComplete(Boolean certificationComplete) { this.certificationComplete = certificationComplete; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}

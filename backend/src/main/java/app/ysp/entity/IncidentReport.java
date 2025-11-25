package app.ysp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "incident_reports")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class IncidentReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "incident_time", nullable = false)
    private LocalTime incidentTime;

    @Column(name = "shift", length = 50)
    private String shift;

    @Column(name = "area_of_incident", length = 100)
    private String areaOfIncident;

    @Column(name = "nature_of_incident", length = 100, nullable = false)
    private String natureOfIncident;

    @Column(name = "residents_involved", columnDefinition = "TEXT")
    private String residentsInvolved;

    @Column(name = "staff_involved", columnDefinition = "TEXT")
    private String staffInvolved;

    @Column(name = "resident_witnesses", columnDefinition = "TEXT")
    private String residentWitnesses;

    @Column(name = "primary_staff_restraint")
    private String primaryStaffRestraint;

    @Column(name = "mechanicals_start_time")
    private LocalTime mechanicalsStartTime;

    @Column(name = "mechanicals_finish_time")
    private LocalTime mechanicalsFinishTime;

    @Column(name = "room_confinement_start_time")
    private LocalTime roomConfinementStartTime;

    @Column(name = "room_confinement_finish_time")
    private LocalTime roomConfinementFinishTime;

    @Column(name = "staff_population")
    private Integer staffPopulation;

    @Column(name = "youth_population")
    private Integer youthPopulation;

    @Column(name = "detailed_description", columnDefinition = "TEXT", nullable = false)
    private String detailedDescription;

    @Column(name = "report_completed_by", nullable = false)
    private String reportCompletedBy;

    @Column(name = "report_completed_by_email")
    private String reportCompletedByEmail;

    @Column(name = "signature_datetime", nullable = false)
    private LocalDateTime signatureDatetime;

    @Column(name = "certification_complete")
    private Boolean certificationComplete = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "status", length = 50)
    private String status = "Submitted";

    @Column(name = "priority", length = 20)
    private String priority;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (priority == null) priority = calculatePriority();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private String calculatePriority() {
        if (natureOfIncident == null) return "Low";
        String nature = natureOfIncident.toLowerCase();
        
        if (nature.contains("assault") || nature.contains("escape") || 
            nature.contains("suicide") || nature.contains("weapon")) {
            return "Critical";
        } else if (nature.contains("restraint") || nature.contains("contraband") || 
                   nature.contains("damage") || nature.contains("medication error")) {
            return "High";
        } else if (nature.contains("alarm") || nature.contains("confinement")) {
            return "Medium";
        }
        return "Low";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}

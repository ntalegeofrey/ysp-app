package app.ysp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "fire_drill_reports")
public class FireDrillReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    @JsonIgnoreProperties({"assignments", "residents", "incidents", "firePlans", "fireDrillReports", "hibernateLazyInitializer", "handler"})
    private Program program;

    @Column(name = "drill_date", nullable = false)
    private LocalDate drillDate;

    @Column(name = "drill_time")
    private LocalTime drillTime;

    @Column(name = "drill_type")
    private String drillType; // Scheduled, Unannounced, Actual Emergency

    @Column(name = "shift")
    private String shift;

    @Column(name = "shift_supervisor")
    private String shiftSupervisor;

    @Column(name = "report_completed_by")
    private String reportCompletedBy;

    @Column(name = "total_evacuation_time")
    private String totalEvacuationTime;

    @Column(name = "weather_conditions")
    private String weatherConditions;

    @Column(name = "total_staff_present")
    private Integer totalStaffPresent;

    @Column(name = "total_residents_present")
    private Integer totalResidentsPresent;

    @Column(name = "overall_performance", columnDefinition = "text")
    private String overallPerformance;

    @Column(name = "issues_identified", columnDefinition = "text")
    private String issuesIdentified;

    @Column(name = "recommendations", columnDefinition = "text")
    private String recommendations;

    @Column(name = "route_performance_json", columnDefinition = "TEXT")
    private String routePerformanceJson;

    @Column(name = "certification_complete")
    private Boolean certificationComplete;

    @Column(name = "digital_signature")
    private String digitalSignature;

    @Column(name = "signature_datetime")
    private LocalDateTime signatureDatetime;

    @Column(name = "status")
    private String status; // Successful, Issues Found, Failed

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public LocalDate getDrillDate() { return drillDate; }
    public void setDrillDate(LocalDate drillDate) { this.drillDate = drillDate; }

    public LocalTime getDrillTime() { return drillTime; }
    public void setDrillTime(LocalTime drillTime) { this.drillTime = drillTime; }

    public String getDrillType() { return drillType; }
    public void setDrillType(String drillType) { this.drillType = drillType; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getShiftSupervisor() { return shiftSupervisor; }
    public void setShiftSupervisor(String shiftSupervisor) { this.shiftSupervisor = shiftSupervisor; }

    public String getReportCompletedBy() { return reportCompletedBy; }
    public void setReportCompletedBy(String reportCompletedBy) { this.reportCompletedBy = reportCompletedBy; }

    public String getTotalEvacuationTime() { return totalEvacuationTime; }
    public void setTotalEvacuationTime(String totalEvacuationTime) { this.totalEvacuationTime = totalEvacuationTime; }

    public String getWeatherConditions() { return weatherConditions; }
    public void setWeatherConditions(String weatherConditions) { this.weatherConditions = weatherConditions; }

    public Integer getTotalStaffPresent() { return totalStaffPresent; }
    public void setTotalStaffPresent(Integer totalStaffPresent) { this.totalStaffPresent = totalStaffPresent; }

    public Integer getTotalResidentsPresent() { return totalResidentsPresent; }
    public void setTotalResidentsPresent(Integer totalResidentsPresent) { this.totalResidentsPresent = totalResidentsPresent; }

    public String getOverallPerformance() { return overallPerformance; }
    public void setOverallPerformance(String overallPerformance) { this.overallPerformance = overallPerformance; }

    public String getIssuesIdentified() { return issuesIdentified; }
    public void setIssuesIdentified(String issuesIdentified) { this.issuesIdentified = issuesIdentified; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public String getRoutePerformanceJson() { return routePerformanceJson; }
    public void setRoutePerformanceJson(String routePerformanceJson) { this.routePerformanceJson = routePerformanceJson; }

    public Boolean getCertificationComplete() { return certificationComplete; }
    public void setCertificationComplete(Boolean certificationComplete) { this.certificationComplete = certificationComplete; }

    public String getDigitalSignature() { return digitalSignature; }
    public void setDigitalSignature(String digitalSignature) { this.digitalSignature = digitalSignature; }

    public LocalDateTime getSignatureDatetime() { return signatureDatetime; }
    public void setSignatureDatetime(LocalDateTime signatureDatetime) { this.signatureDatetime = signatureDatetime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

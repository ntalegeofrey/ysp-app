package app.ysp.dto;

import java.time.Instant;
import java.time.LocalTime;

public class MedicationAlertResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private Long residentMedicationId;
    private String medicationName;
    private String dosage;
    private String alertType; // CRITICAL, WARNING, INFO
    private String title;
    private String description;
    private LocalTime alertTime;
    private String status; // ACTIVE, RESOLVED
    
    // Resolution info
    private Long resolvedByStaffId;
    private String resolvedByStaffName;
    private Instant resolvedAt;
    
    // Timestamp
    private Instant createdAt;

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

    public Long getResidentMedicationId() {
        return residentMedicationId;
    }

    public void setResidentMedicationId(Long residentMedicationId) {
        this.residentMedicationId = residentMedicationId;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }

    public String getDosage() {
        return dosage;
    }

    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalTime getAlertTime() {
        return alertTime;
    }

    public void setAlertTime(LocalTime alertTime) {
        this.alertTime = alertTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getResolvedByStaffId() {
        return resolvedByStaffId;
    }

    public void setResolvedByStaffId(Long resolvedByStaffId) {
        this.resolvedByStaffId = resolvedByStaffId;
    }

    public String getResolvedByStaffName() {
        return resolvedByStaffName;
    }

    public void setResolvedByStaffName(String resolvedByStaffName) {
        this.resolvedByStaffName = resolvedByStaffName;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

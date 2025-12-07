package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

public class MedicationAdministrationResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private Long residentMedicationId;
    private String medicationName;
    private String dosage;
    private LocalDate administrationDate;
    private LocalTime administrationTime;
    private String shift;
    private String action;
    private String notes;
    private Boolean wasLate;
    private Integer minutesLate;
    
    // Staff information
    private Long administeredByStaffId;
    private String administeredByStaffName;
    
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

    public LocalDate getAdministrationDate() {
        return administrationDate;
    }

    public void setAdministrationDate(LocalDate administrationDate) {
        this.administrationDate = administrationDate;
    }

    public LocalTime getAdministrationTime() {
        return administrationTime;
    }

    public void setAdministrationTime(LocalTime administrationTime) {
        this.administrationTime = administrationTime;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getWasLate() {
        return wasLate;
    }

    public void setWasLate(Boolean wasLate) {
        this.wasLate = wasLate;
    }

    public Integer getMinutesLate() {
        return minutesLate;
    }

    public void setMinutesLate(Integer minutesLate) {
        this.minutesLate = minutesLate;
    }

    public Long getAdministeredByStaffId() {
        return administeredByStaffId;
    }

    public void setAdministeredByStaffId(Long administeredByStaffId) {
        this.administeredByStaffId = administeredByStaffId;
    }

    public String getAdministeredByStaffName() {
        return administeredByStaffName;
    }

    public void setAdministeredByStaffName(String administeredByStaffName) {
        this.administeredByStaffName = administeredByStaffName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

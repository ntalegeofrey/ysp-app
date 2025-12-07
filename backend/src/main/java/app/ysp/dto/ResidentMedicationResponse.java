package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;

public class ResidentMedicationResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private String medicationName;
    private String dosage;
    private String frequency;
    private Integer initialCount;
    private Integer currentCount;
    private String prescribingPhysician;
    private String specialInstructions;
    private LocalDate prescriptionDate;
    private String status;
    
    // Staff information
    private Long addedByStaffId;
    private String addedByStaffName;
    
    // Timestamps
    private Instant createdAt;
    private Instant updatedAt;
    
    // Computed fields
    private Integer remainingCount; // Same as currentCount but clearer name
    private Boolean isLowInventory; // true if below threshold

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

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Integer getInitialCount() {
        return initialCount;
    }

    public void setInitialCount(Integer initialCount) {
        this.initialCount = initialCount;
    }

    public Integer getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(Integer currentCount) {
        this.currentCount = currentCount;
    }

    public String getPrescribingPhysician() {
        return prescribingPhysician;
    }

    public void setPrescribingPhysician(String prescribingPhysician) {
        this.prescribingPhysician = prescribingPhysician;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public LocalDate getPrescriptionDate() {
        return prescriptionDate;
    }

    public void setPrescriptionDate(LocalDate prescriptionDate) {
        this.prescriptionDate = prescriptionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAddedByStaffId() {
        return addedByStaffId;
    }

    public void setAddedByStaffId(Long addedByStaffId) {
        this.addedByStaffId = addedByStaffId;
    }

    public String getAddedByStaffName() {
        return addedByStaffName;
    }

    public void setAddedByStaffName(String addedByStaffName) {
        this.addedByStaffName = addedByStaffName;
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

    public Integer getRemainingCount() {
        return remainingCount;
    }

    public void setRemainingCount(Integer remainingCount) {
        this.remainingCount = remainingCount;
    }

    public Boolean getIsLowInventory() {
        return isLowInventory;
    }

    public void setIsLowInventory(Boolean isLowInventory) {
        this.isLowInventory = isLowInventory;
    }
}

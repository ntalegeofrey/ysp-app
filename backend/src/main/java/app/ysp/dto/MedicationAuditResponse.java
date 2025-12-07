package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class MedicationAuditResponse {
    private Long id;
    private Long programId;
    private LocalDate auditDate;
    private LocalTime auditTime;
    private String shift;
    private String auditNotes;
    private String status;
    private Boolean hasDiscrepancies;
    
    // Submission info
    private Long submittedByStaffId;
    private String submittedByStaffName;
    
    // Approval info
    private Long approvedByStaffId;
    private String approvedByStaffName;
    private Instant approvalDate;
    private String approvalNotes;
    
    // Counts
    private List<AuditCountDetail> counts;
    
    // Timestamps
    private Instant createdAt;
    private Instant updatedAt;
    
    // Computed fields
    private Integer totalMedications;
    private Integer totalResidents;
    private Integer discrepancyCount;

    // Inner class for audit count details
    public static class AuditCountDetail {
        private Long id;
        private Long residentId;
        private String residentName;
        private String residentNumber;
        private Long residentMedicationId;
        private String medicationName;
        private String dosage;
        private Integer previousCount;
        private Integer currentCount;
        private Integer variance;
        private String previousStaffName;
        private String notes;

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

        public Integer getPreviousCount() {
            return previousCount;
        }

        public void setPreviousCount(Integer previousCount) {
            this.previousCount = previousCount;
        }

        public Integer getCurrentCount() {
            return currentCount;
        }

        public void setCurrentCount(Integer currentCount) {
            this.currentCount = currentCount;
        }

        public Integer getVariance() {
            return variance;
        }

        public void setVariance(Integer variance) {
            this.variance = variance;
        }

        public String getPreviousStaffName() {
            return previousStaffName;
        }

        public void setPreviousStaffName(String previousStaffName) {
            this.previousStaffName = previousStaffName;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

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

    public LocalDate getAuditDate() {
        return auditDate;
    }

    public void setAuditDate(LocalDate auditDate) {
        this.auditDate = auditDate;
    }

    public LocalTime getAuditTime() {
        return auditTime;
    }

    public void setAuditTime(LocalTime auditTime) {
        this.auditTime = auditTime;
    }

    public String getShift() {
        return shift;
    }

    public void setShift(String shift) {
        this.shift = shift;
    }

    public String getAuditNotes() {
        return auditNotes;
    }

    public void setAuditNotes(String auditNotes) {
        this.auditNotes = auditNotes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getHasDiscrepancies() {
        return hasDiscrepancies;
    }

    public void setHasDiscrepancies(Boolean hasDiscrepancies) {
        this.hasDiscrepancies = hasDiscrepancies;
    }

    public Long getSubmittedByStaffId() {
        return submittedByStaffId;
    }

    public void setSubmittedByStaffId(Long submittedByStaffId) {
        this.submittedByStaffId = submittedByStaffId;
    }

    public String getSubmittedByStaffName() {
        return submittedByStaffName;
    }

    public void setSubmittedByStaffName(String submittedByStaffName) {
        this.submittedByStaffName = submittedByStaffName;
    }

    public Long getApprovedByStaffId() {
        return approvedByStaffId;
    }

    public void setApprovedByStaffId(Long approvedByStaffId) {
        this.approvedByStaffId = approvedByStaffId;
    }

    public String getApprovedByStaffName() {
        return approvedByStaffName;
    }

    public void setApprovedByStaffName(String approvedByStaffName) {
        this.approvedByStaffName = approvedByStaffName;
    }

    public Instant getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(Instant approvalDate) {
        this.approvalDate = approvalDate;
    }

    public String getApprovalNotes() {
        return approvalNotes;
    }

    public void setApprovalNotes(String approvalNotes) {
        this.approvalNotes = approvalNotes;
    }

    public List<AuditCountDetail> getCounts() {
        return counts;
    }

    public void setCounts(List<AuditCountDetail> counts) {
        this.counts = counts;
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

    public Integer getTotalMedications() {
        return totalMedications;
    }

    public void setTotalMedications(Integer totalMedications) {
        this.totalMedications = totalMedications;
    }

    public Integer getTotalResidents() {
        return totalResidents;
    }

    public void setTotalResidents(Integer totalResidents) {
        this.totalResidents = totalResidents;
    }

    public Integer getDiscrepancyCount() {
        return discrepancyCount;
    }

    public void setDiscrepancyCount(Integer discrepancyCount) {
        this.discrepancyCount = discrepancyCount;
    }
}

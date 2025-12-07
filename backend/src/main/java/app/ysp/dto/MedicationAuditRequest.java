package app.ysp.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class MedicationAuditRequest {
    private LocalDate auditDate;
    private LocalTime auditTime;
    private String shift; // MORNING, EVENING, NIGHT
    private String auditNotes;
    private List<AuditCountItem> counts;

    // Inner class for audit count items
    public static class AuditCountItem {
        private Long residentId;
        private Long residentMedicationId;
        private Integer previousCount;
        private Integer currentCount;
        private String notes;

        // Getters and Setters
        public Long getResidentId() {
            return residentId;
        }

        public void setResidentId(Long residentId) {
            this.residentId = residentId;
        }

        public Long getResidentMedicationId() {
            return residentMedicationId;
        }

        public void setResidentMedicationId(Long residentMedicationId) {
            this.residentMedicationId = residentMedicationId;
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

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    // Getters and Setters
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

    public List<AuditCountItem> getCounts() {
        return counts;
    }

    public void setCounts(List<AuditCountItem> counts) {
        this.counts = counts;
    }
}

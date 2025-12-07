package app.ysp.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class MedicationAdministrationRequest {
    private Long residentId;
    private Long residentMedicationId;
    private LocalDate administrationDate;
    private LocalTime administrationTime;
    private String shift; // MORNING, EVENING, NIGHT
    private String action; // ADMINISTERED, REFUSED, LATE, MISSED, HELD
    private String notes;
    private Boolean wasLate;
    private Integer minutesLate;

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
}

package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "medication_administrations")
public class MedicationAdministration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_medication_id", nullable = false)
    private ResidentMedication residentMedication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administered_by_staff_id", nullable = false)
    private User administeredByStaff;

    @Column(name = "administration_date", nullable = false)
    private LocalDate administrationDate;

    @Column(name = "administration_time", nullable = false)
    private LocalTime administrationTime;

    @Column(name = "shift", nullable = false, length = 20)
    private String shift; // MORNING, EVENING, NIGHT

    @Column(name = "action", nullable = false, length = 50)
    private String action; // ADMINISTERED, REFUSED, LATE, MISSED, HELD

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "was_late")
    private Boolean wasLate = false;

    @Column(name = "minutes_late")
    private Integer minutesLate;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProgramResident getResident() {
        return resident;
    }

    public void setResident(ProgramResident resident) {
        this.resident = resident;
    }

    public ResidentMedication getResidentMedication() {
        return residentMedication;
    }

    public void setResidentMedication(ResidentMedication residentMedication) {
        this.residentMedication = residentMedication;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public User getAdministeredByStaff() {
        return administeredByStaff;
    }

    public void setAdministeredByStaff(User administeredByStaff) {
        this.administeredByStaff = administeredByStaff;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

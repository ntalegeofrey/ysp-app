package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "resident_medications")
public class ResidentMedication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "medication_name", nullable = false, length = 255)
    private String medicationName;

    @Column(name = "dosage", nullable = false, length = 100)
    private String dosage;

    @Column(name = "frequency", nullable = false, length = 100)
    private String frequency;

    @Column(name = "initial_count", nullable = false)
    private Integer initialCount;

    @Column(name = "current_count", nullable = false)
    private Integer currentCount;

    @Column(name = "prescribing_physician", length = 255)
    private String prescribingPhysician;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "prescription_date")
    private LocalDate prescriptionDate;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, DISCONTINUED, EXPIRED, ON_HOLD

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "added_by_staff_id", nullable = false)
    private User addedByStaff;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
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

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
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

    public User getAddedByStaff() {
        return addedByStaff;
    }

    public void setAddedByStaff(User addedByStaff) {
        this.addedByStaff = addedByStaff;
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
}

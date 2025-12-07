package app.ysp.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "medication_audit_counts")
public class MedicationAuditCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_id", nullable = false)
    private MedicationAudit audit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_medication_id", nullable = false)
    private ResidentMedication residentMedication;

    @Column(name = "previous_count", nullable = false)
    private Integer previousCount;

    @Column(name = "current_count", nullable = false)
    private Integer currentCount;

    @Column(name = "variance", nullable = false)
    private Integer variance;

    @Column(name = "previous_staff_name", length = 255)
    private String previousStaffName;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

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

    public MedicationAudit getAudit() {
        return audit;
    }

    public void setAudit(MedicationAudit audit) {
        this.audit = audit;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

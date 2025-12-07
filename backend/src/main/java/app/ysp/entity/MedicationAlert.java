package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalTime;

@Entity
@Table(name = "medication_alerts")
public class MedicationAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id")
    private ProgramResident resident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_medication_id")
    private ResidentMedication residentMedication;

    @Column(name = "alert_type", nullable = false, length = 50)
    private String alertType; // CRITICAL, WARNING, INFO

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "alert_time", nullable = false)
    private LocalTime alertTime;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE"; // ACTIVE, RESOLVED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by_staff_id")
    private User resolvedByStaff;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

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

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
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

    public User getResolvedByStaff() {
        return resolvedByStaff;
    }

    public void setResolvedByStaff(User resolvedByStaff) {
        this.resolvedByStaff = resolvedByStaff;
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

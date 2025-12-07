package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medication_audits")
public class MedicationAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "audit_date", nullable = false)
    private LocalDate auditDate;

    @Column(name = "audit_time", nullable = false)
    private LocalTime auditTime;

    @Column(name = "shift", nullable = false, length = 20)
    private String shift; // MORNING, EVENING, NIGHT

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_staff_id", nullable = false)
    private User submittedByStaff;

    @Column(name = "audit_notes", columnDefinition = "TEXT")
    private String auditNotes;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "PENDING"; // PENDING, APPROVED, DENIED

    @Column(name = "has_discrepancies")
    private Boolean hasDiscrepancies = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by_staff_id")
    private User approvedByStaff;

    @Column(name = "approval_date")
    private Instant approvalDate;

    @Column(name = "approval_notes", columnDefinition = "TEXT")
    private String approvalNotes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "audit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicationAuditCount> counts = new ArrayList<>();

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

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
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

    public User getSubmittedByStaff() {
        return submittedByStaff;
    }

    public void setSubmittedByStaff(User submittedByStaff) {
        this.submittedByStaff = submittedByStaff;
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

    public User getApprovedByStaff() {
        return approvedByStaff;
    }

    public void setApprovedByStaff(User approvedByStaff) {
        this.approvedByStaff = approvedByStaff;
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

    public List<MedicationAuditCount> getCounts() {
        return counts;
    }

    public void setCounts(List<MedicationAuditCount> counts) {
        this.counts = counts;
    }
}

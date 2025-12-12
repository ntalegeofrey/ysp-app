package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_audits")
public class InventoryAudit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @Column(name = "audit_type", nullable = false, length = 50)
    private String auditType = "PHYSICAL_COUNT";
    
    @Column(name = "audit_date", nullable = false)
    private LocalDate auditDate;
    
    @Column(name = "audit_status", length = 50)
    private String auditStatus = "IN_PROGRESS";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conducted_by", nullable = false)
    private User conductedBy;
    
    @Column(name = "auditor_name")
    private String auditorName;
    
    @Column(name = "total_items_audited")
    private Integer totalItemsAudited = 0;
    
    @Column(name = "discrepancies_found")
    private Integer discrepanciesFound = 0;
    
    @Column(name = "notes")
    private String notes;
    
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "completed_at")
    private Instant completedAt;
    
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
    
    public LocalDate getAuditDate() {
        return auditDate;
    }
    
    public void setAuditDate(LocalDate auditDate) {
        this.auditDate = auditDate;
    }
    
    public User getConductedBy() {
        return conductedBy;
    }
    
    public void setConductedBy(User conductedBy) {
        this.conductedBy = conductedBy;
    }
    
    public String getAuditorName() {
        return auditorName;
    }
    
    public void setAuditorName(String auditorName) {
        this.auditorName = auditorName;
    }
    
    public Integer getTotalItemsAudited() {
        return totalItemsAudited;
    }
    
    public void setTotalItemsAudited(Integer totalItemsAudited) {
        this.totalItemsAudited = totalItemsAudited;
    }
    
    public Integer getDiscrepanciesFound() {
        return discrepanciesFound;
    }
    
    public void setDiscrepanciesFound(Integer discrepanciesFound) {
        this.discrepanciesFound = discrepanciesFound;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    
    public String getAuditType() {
        return auditType;
    }
    
    public void setAuditType(String auditType) {
        this.auditType = auditType;
    }
    
    public String getAuditStatus() {
        return auditStatus;
    }
    
    public void setAuditStatus(String auditStatus) {
        this.auditStatus = auditStatus;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Instant getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}

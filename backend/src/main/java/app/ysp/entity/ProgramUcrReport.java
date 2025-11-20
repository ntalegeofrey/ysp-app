package app.ysp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "program_ucr_reports")
public class ProgramUcrReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(name = "shift")
    private String shift;

    @Column(name = "reporter_name")
    private String reporterName;

    @Column(name = "status")
    private String status;

    @Column(name = "issues_summary")
    private String issuesSummary;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = java.time.LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public LocalDate getReportDate() { return reportDate; }
    public void setReportDate(LocalDate reportDate) { this.reportDate = reportDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIssuesSummary() { return issuesSummary; }
    public void setIssuesSummary(String issuesSummary) { this.issuesSummary = issuesSummary; }

    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
}

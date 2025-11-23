package app.ysp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "program_ucr_notifications")
public class ProgramUcrNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ucr_report_id", nullable = false)
    private ProgramUcrReport ucrReport;

    @Column(name = "alert_status", length = 32, nullable = false)
    private String alertStatus;

    @Column(name = "issue_title", length = 255, nullable = false)
    private String issueTitle;

    @Column(name = "issue_summary", columnDefinition = "TEXT")
    private String issueSummary;

    @Column(name = "issue_last_reported_at")
    private LocalDateTime issueLastReportedAt;

    @Column(name = "issue_last_reported_by", length = 255)
    private String issueLastReportedBy;

    @Column(name = "issue_occurrence_count")
    private Integer issueOccurrenceCount;

    @Column(name = "issue_category", length = 128, nullable = false)
    private String issueCategory;

    @Column(name = "priority_level", length = 32, nullable = false)
    private String priorityLevel;

    @Column(name = "subject_line", length = 512, nullable = false)
    private String subjectLine;

    @Column(name = "additional_comments", columnDefinition = "TEXT")
    private String additionalComments;

    @Column(name = "notified_to_emails", columnDefinition = "TEXT")
    private String notifiedToEmails;

    @Column(name = "notification_channel", length = 32, nullable = false)
    private String notificationChannel;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public ProgramUcrReport getUcrReport() { return ucrReport; }
    public void setUcrReport(ProgramUcrReport ucrReport) { this.ucrReport = ucrReport; }

    public String getAlertStatus() { return alertStatus; }
    public void setAlertStatus(String alertStatus) { this.alertStatus = alertStatus; }

    public String getIssueTitle() { return issueTitle; }
    public void setIssueTitle(String issueTitle) { this.issueTitle = issueTitle; }

    public String getIssueSummary() { return issueSummary; }
    public void setIssueSummary(String issueSummary) { this.issueSummary = issueSummary; }

    public LocalDateTime getIssueLastReportedAt() { return issueLastReportedAt; }
    public void setIssueLastReportedAt(LocalDateTime issueLastReportedAt) { this.issueLastReportedAt = issueLastReportedAt; }

    public String getIssueLastReportedBy() { return issueLastReportedBy; }
    public void setIssueLastReportedBy(String issueLastReportedBy) { this.issueLastReportedBy = issueLastReportedBy; }

    public Integer getIssueOccurrenceCount() { return issueOccurrenceCount; }
    public void setIssueOccurrenceCount(Integer issueOccurrenceCount) { this.issueOccurrenceCount = issueOccurrenceCount; }

    public String getIssueCategory() { return issueCategory; }
    public void setIssueCategory(String issueCategory) { this.issueCategory = issueCategory; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public String getSubjectLine() { return subjectLine; }
    public void setSubjectLine(String subjectLine) { this.subjectLine = subjectLine; }

    public String getAdditionalComments() { return additionalComments; }
    public void setAdditionalComments(String additionalComments) { this.additionalComments = additionalComments; }

    public String getNotifiedToEmails() { return notifiedToEmails; }
    public void setNotifiedToEmails(String notifiedToEmails) { this.notifiedToEmails = notifiedToEmails; }

    public String getNotificationChannel() { return notificationChannel; }
    public void setNotificationChannel(String notificationChannel) { this.notificationChannel = notificationChannel; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "phone_logs")
public class PhoneLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @Column(name = "call_type", nullable = false, length = 50)
    private String callType; // OUTGOING, INCOMING, LEGAL, EMERGENCY

    @Column(name = "contact_relationship", nullable = false, length = 50)
    private String contactRelationship; // MOTHER_1, FATHER_1, SISTER, ATTORNEY, etc.

    @Column(name = "contact_name", length = 200)
    private String contactName;

    @Column(name = "other_relationship_details", length = 500)
    private String otherRelationshipDetails;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "call_date_time", nullable = false)
    private Instant callDateTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorizing_staff_id", nullable = false)
    private User authorizingStaff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitoring_staff_id", nullable = false)
    private User monitoringStaff;

    @Column(name = "behavior_during_call", nullable = false, length = 50)
    private String behaviorDuringCall; // POSITIVE, NEUTRAL, AGITATED, DISTRESSED, CONCERNING

    @Column(name = "post_call_behavior", nullable = false, length = 50)
    private String postCallBehavior; // IMPROVED, NO_CHANGE, SLIGHTLY_ELEVATED, SIGNIFICANTLY_IMPACTED, CRISIS_LEVEL

    @Column(name = "additional_comments", columnDefinition = "TEXT")
    private String additionalComments;

    @Column(name = "call_terminated_early")
    private Boolean callTerminatedEarly = false;

    @Column(name = "termination_reason", columnDefinition = "TEXT")
    private String terminationReason;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "logged_by_staff_id", nullable = false)
    private User loggedByStaff;

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

    public String getCallType() {
        return callType;
    }

    public void setCallType(String callType) {
        this.callType = callType;
    }

    public String getContactRelationship() {
        return contactRelationship;
    }

    public void setContactRelationship(String contactRelationship) {
        this.contactRelationship = contactRelationship;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getOtherRelationshipDetails() {
        return otherRelationshipDetails;
    }

    public void setOtherRelationshipDetails(String otherRelationshipDetails) {
        this.otherRelationshipDetails = otherRelationshipDetails;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Instant getCallDateTime() {
        return callDateTime;
    }

    public void setCallDateTime(Instant callDateTime) {
        this.callDateTime = callDateTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public User getAuthorizingStaff() {
        return authorizingStaff;
    }

    public void setAuthorizingStaff(User authorizingStaff) {
        this.authorizingStaff = authorizingStaff;
    }

    public User getMonitoringStaff() {
        return monitoringStaff;
    }

    public void setMonitoringStaff(User monitoringStaff) {
        this.monitoringStaff = monitoringStaff;
    }

    public String getBehaviorDuringCall() {
        return behaviorDuringCall;
    }

    public void setBehaviorDuringCall(String behaviorDuringCall) {
        this.behaviorDuringCall = behaviorDuringCall;
    }

    public String getPostCallBehavior() {
        return postCallBehavior;
    }

    public void setPostCallBehavior(String postCallBehavior) {
        this.postCallBehavior = postCallBehavior;
    }

    public String getAdditionalComments() {
        return additionalComments;
    }

    public void setAdditionalComments(String additionalComments) {
        this.additionalComments = additionalComments;
    }

    public Boolean getCallTerminatedEarly() {
        return callTerminatedEarly;
    }

    public void setCallTerminatedEarly(Boolean callTerminatedEarly) {
        this.callTerminatedEarly = callTerminatedEarly;
    }

    public String getTerminationReason() {
        return terminationReason;
    }

    public void setTerminationReason(String terminationReason) {
        this.terminationReason = terminationReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public User getLoggedByStaff() {
        return loggedByStaff;
    }

    public void setLoggedByStaff(User loggedByStaff) {
        this.loggedByStaff = loggedByStaff;
    }
}

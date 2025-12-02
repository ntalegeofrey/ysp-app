package app.ysp.dto;

import java.time.Instant;

public class PhoneLogRequest {
    private Long residentId;
    private String callType; // OUTGOING, INCOMING, LEGAL, EMERGENCY
    private String contactRelationship; // MOTHER_1, FATHER_1, etc.
    private String contactName;
    private String otherRelationshipDetails;
    private String phoneNumber;
    private Instant callDateTime;
    private Integer durationMinutes;
    private Long authorizingStaffId;
    private Long monitoringStaffId;
    private String behaviorDuringCall; // POSITIVE, NEUTRAL, AGITATED, DISTRESSED, CONCERNING
    private String postCallBehavior; // IMPROVED, NO_CHANGE, SLIGHTLY_ELEVATED, SIGNIFICANTLY_IMPACTED, CRISIS_LEVEL
    private String additionalComments;
    private Boolean callTerminatedEarly;
    private String terminationReason;

    // Getters and Setters
    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
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

    public Long getAuthorizingStaffId() {
        return authorizingStaffId;
    }

    public void setAuthorizingStaffId(Long authorizingStaffId) {
        this.authorizingStaffId = authorizingStaffId;
    }

    public Long getMonitoringStaffId() {
        return monitoringStaffId;
    }

    public void setMonitoringStaffId(Long monitoringStaffId) {
        this.monitoringStaffId = monitoringStaffId;
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
}

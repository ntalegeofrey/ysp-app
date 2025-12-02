package app.ysp.dto;

import java.time.Instant;

public class PhoneLogResponse {
    private Long id;
    private Long programId;
    private Long residentId;
    private String residentName;
    private String residentNumber;
    private String callType;
    private String contactRelationship;
    private String contactName;
    private String otherRelationshipDetails;
    private String phoneNumber;
    private Instant callDateTime;
    private Integer durationMinutes;
    
    // Staff information
    private Long authorizingStaffId;
    private String authorizingStaffName;
    private Long monitoringStaffId;
    private String monitoringStaffName;
    private Long loggedByStaffId;
    private String loggedByStaffName;
    
    // Behavioral observations
    private String behaviorDuringCall;
    private String postCallBehavior;
    private String additionalComments;
    
    // Termination information
    private Boolean callTerminatedEarly;
    private String terminationReason;
    
    // Timestamp
    private Instant createdAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
    }

    public String getResidentName() {
        return residentName;
    }

    public void setResidentName(String residentName) {
        this.residentName = residentName;
    }

    public String getResidentNumber() {
        return residentNumber;
    }

    public void setResidentNumber(String residentNumber) {
        this.residentNumber = residentNumber;
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

    public String getAuthorizingStaffName() {
        return authorizingStaffName;
    }

    public void setAuthorizingStaffName(String authorizingStaffName) {
        this.authorizingStaffName = authorizingStaffName;
    }

    public Long getMonitoringStaffId() {
        return monitoringStaffId;
    }

    public void setMonitoringStaffId(Long monitoringStaffId) {
        this.monitoringStaffId = monitoringStaffId;
    }

    public String getMonitoringStaffName() {
        return monitoringStaffName;
    }

    public void setMonitoringStaffName(String monitoringStaffName) {
        this.monitoringStaffName = monitoringStaffName;
    }

    public Long getLoggedByStaffId() {
        return loggedByStaffId;
    }

    public void setLoggedByStaffId(Long loggedByStaffId) {
        this.loggedByStaffId = loggedByStaffId;
    }

    public String getLoggedByStaffName() {
        return loggedByStaffName;
    }

    public void setLoggedByStaffName(String loggedByStaffName) {
        this.loggedByStaffName = loggedByStaffName;
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
}

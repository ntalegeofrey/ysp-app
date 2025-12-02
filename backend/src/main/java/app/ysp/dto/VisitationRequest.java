package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class VisitationRequest {
    private Long residentId;
    private String visitType; // IN_PERSON, VIDEO, PROFESSIONAL, LEGAL
    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW
    private String approvalStatus; // APPROVED, PENDING, DENIED
    private List<VisitorInfo> visitorInfo;
    private LocalDate scheduledDate;
    private Instant scheduledStartTime;
    private Instant scheduledEndTime;
    private String visitationRoom;
    private String specialInstructions;
    private Long supervisingStaffId;

    // Getters and Setters
    public Long getResidentId() {
        return residentId;
    }

    public void setResidentId(Long residentId) {
        this.residentId = residentId;
    }

    public String getVisitType() {
        return visitType;
    }

    public void setVisitType(String visitType) {
        this.visitType = visitType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public List<VisitorInfo> getVisitorInfo() {
        return visitorInfo;
    }

    public void setVisitorInfo(List<VisitorInfo> visitorInfo) {
        this.visitorInfo = visitorInfo;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Instant getScheduledStartTime() {
        return scheduledStartTime;
    }

    public void setScheduledStartTime(Instant scheduledStartTime) {
        this.scheduledStartTime = scheduledStartTime;
    }

    public Instant getScheduledEndTime() {
        return scheduledEndTime;
    }

    public void setScheduledEndTime(Instant scheduledEndTime) {
        this.scheduledEndTime = scheduledEndTime;
    }

    public String getVisitationRoom() {
        return visitationRoom;
    }

    public void setVisitationRoom(String visitationRoom) {
        this.visitationRoom = visitationRoom;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public Long getSupervisingStaffId() {
        return supervisingStaffId;
    }

    public void setSupervisingStaffId(Long supervisingStaffId) {
        this.supervisingStaffId = supervisingStaffId;
    }
}

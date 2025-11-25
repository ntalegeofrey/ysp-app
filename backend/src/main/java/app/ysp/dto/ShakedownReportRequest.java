package app.ysp.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ShakedownReportRequest {
    private LocalDate shakedownDate;
    private String shift;
    private String commonAreaSearches;
    private String schoolAreaSearches;
    private String residentRoomSearches;
    private String equipmentCondition;
    private LocalTime announcementTime;
    private String announcementStaff;
    private String announcementAreas;
    private String additionalComments;
    private String reportCompletedBy;
    private String reportCompletedByEmail;
    private LocalDateTime signatureDatetime;
    private Boolean certificationComplete;
    private Boolean contrabandFound;
    private Long createdBy;

    // Getters and Setters
    public LocalDate getShakedownDate() { return shakedownDate; }
    public void setShakedownDate(LocalDate shakedownDate) { this.shakedownDate = shakedownDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getCommonAreaSearches() { return commonAreaSearches; }
    public void setCommonAreaSearches(String commonAreaSearches) { this.commonAreaSearches = commonAreaSearches; }

    public String getSchoolAreaSearches() { return schoolAreaSearches; }
    public void setSchoolAreaSearches(String schoolAreaSearches) { this.schoolAreaSearches = schoolAreaSearches; }

    public String getResidentRoomSearches() { return residentRoomSearches; }
    public void setResidentRoomSearches(String residentRoomSearches) { this.residentRoomSearches = residentRoomSearches; }

    public String getEquipmentCondition() { return equipmentCondition; }
    public void setEquipmentCondition(String equipmentCondition) { this.equipmentCondition = equipmentCondition; }

    public LocalTime getAnnouncementTime() { return announcementTime; }
    public void setAnnouncementTime(LocalTime announcementTime) { this.announcementTime = announcementTime; }

    public String getAnnouncementStaff() { return announcementStaff; }
    public void setAnnouncementStaff(String announcementStaff) { this.announcementStaff = announcementStaff; }

    public String getAnnouncementAreas() { return announcementAreas; }
    public void setAnnouncementAreas(String announcementAreas) { this.announcementAreas = announcementAreas; }

    public String getAdditionalComments() { return additionalComments; }
    public void setAdditionalComments(String additionalComments) { this.additionalComments = additionalComments; }

    public String getReportCompletedBy() { return reportCompletedBy; }
    public void setReportCompletedBy(String reportCompletedBy) { this.reportCompletedBy = reportCompletedBy; }

    public String getReportCompletedByEmail() { return reportCompletedByEmail; }
    public void setReportCompletedByEmail(String reportCompletedByEmail) { this.reportCompletedByEmail = reportCompletedByEmail; }

    public LocalDateTime getSignatureDatetime() { return signatureDatetime; }
    public void setSignatureDatetime(LocalDateTime signatureDatetime) { this.signatureDatetime = signatureDatetime; }

    public Boolean getCertificationComplete() { return certificationComplete; }
    public void setCertificationComplete(Boolean certificationComplete) { this.certificationComplete = certificationComplete; }

    public Boolean getContrabandFound() { return contrabandFound; }
    public void setContrabandFound(Boolean contrabandFound) { this.contrabandFound = contrabandFound; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}

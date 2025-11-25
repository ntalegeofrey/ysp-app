package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class ShiftLogResponse {
    private Long id;
    private Long programId;
    private String programName;
    private LocalDate shiftDate;
    private String shiftType;
    private String unitSupervisor;
    private String residentInitials;
    private Integer residentCount;
    private String residentComments;
    private String incidentsEvents;
    private String overallStatus;
    private String followUpRequired;
    private String shiftSummary;
    private List<StaffAssignment> staffAssignments;
    private Map<String, Object> equipmentCounts;
    private List<AttachmentInfo> attachments;
    private Boolean certificationComplete;
    private Boolean certEquipmentVerified;
    private Boolean certShiftEventsAccurate;
    private Instant certificationDatetime;
    private String reportCompletedBy;
    private String reportCompletedByEmail;
    private Instant createdAt;
    private Instant updatedAt;
    private String status;
    
    // Inner classes for nested data
    public static class StaffAssignment {
        private String name;
        private String position;
        private String duties;
        private String status;
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getPosition() {
            return position;
        }
        
        public void setPosition(String position) {
            this.position = position;
        }
        
        public String getDuties() {
            return duties;
        }
        
        public void setDuties(String duties) {
            this.duties = duties;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
    
    public static class AttachmentInfo {
        private Long id;
        private String fileName;
        private String fileType;
        private Long fileSize;
        private String fileUrl;
        private Instant uploadedAt;
        
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getFileName() {
            return fileName;
        }
        
        public void setFileName(String fileName) {
            this.fileName = fileName;
        }
        
        public String getFileType() {
            return fileType;
        }
        
        public void setFileType(String fileType) {
            this.fileType = fileType;
        }
        
        public Long getFileSize() {
            return fileSize;
        }
        
        public void setFileSize(Long fileSize) {
            this.fileSize = fileSize;
        }
        
        public String getFileUrl() {
            return fileUrl;
        }
        
        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }
        
        public Instant getUploadedAt() {
            return uploadedAt;
        }
        
        public void setUploadedAt(Instant uploadedAt) {
            this.uploadedAt = uploadedAt;
        }
    }
    
    // Main getters and setters
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
    
    public String getProgramName() {
        return programName;
    }
    
    public void setProgramName(String programName) {
        this.programName = programName;
    }
    
    public LocalDate getShiftDate() {
        return shiftDate;
    }
    
    public void setShiftDate(LocalDate shiftDate) {
        this.shiftDate = shiftDate;
    }
    
    public String getShiftType() {
        return shiftType;
    }
    
    public void setShiftType(String shiftType) {
        this.shiftType = shiftType;
    }
    
    public String getUnitSupervisor() {
        return unitSupervisor;
    }
    
    public void setUnitSupervisor(String unitSupervisor) {
        this.unitSupervisor = unitSupervisor;
    }
    
    public String getResidentInitials() {
        return residentInitials;
    }
    
    public void setResidentInitials(String residentInitials) {
        this.residentInitials = residentInitials;
    }
    
    public Integer getResidentCount() {
        return residentCount;
    }
    
    public void setResidentCount(Integer residentCount) {
        this.residentCount = residentCount;
    }
    
    public String getResidentComments() {
        return residentComments;
    }
    
    public void setResidentComments(String residentComments) {
        this.residentComments = residentComments;
    }
    
    public String getIncidentsEvents() {
        return incidentsEvents;
    }
    
    public void setIncidentsEvents(String incidentsEvents) {
        this.incidentsEvents = incidentsEvents;
    }
    
    public String getOverallStatus() {
        return overallStatus;
    }
    
    public void setOverallStatus(String overallStatus) {
        this.overallStatus = overallStatus;
    }
    
    public String getFollowUpRequired() {
        return followUpRequired;
    }
    
    public void setFollowUpRequired(String followUpRequired) {
        this.followUpRequired = followUpRequired;
    }
    
    public String getShiftSummary() {
        return shiftSummary;
    }
    
    public void setShiftSummary(String shiftSummary) {
        this.shiftSummary = shiftSummary;
    }
    
    public List<StaffAssignment> getStaffAssignments() {
        return staffAssignments;
    }
    
    public void setStaffAssignments(List<StaffAssignment> staffAssignments) {
        this.staffAssignments = staffAssignments;
    }
    
    public Map<String, Object> getEquipmentCounts() {
        return equipmentCounts;
    }
    
    public void setEquipmentCounts(Map<String, Object> equipmentCounts) {
        this.equipmentCounts = equipmentCounts;
    }
    
    public List<AttachmentInfo> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<AttachmentInfo> attachments) {
        this.attachments = attachments;
    }
    
    public Boolean getCertificationComplete() {
        return certificationComplete;
    }
    
    public void setCertificationComplete(Boolean certificationComplete) {
        this.certificationComplete = certificationComplete;
    }
    
    public Boolean getCertEquipmentVerified() {
        return certEquipmentVerified;
    }
    
    public void setCertEquipmentVerified(Boolean certEquipmentVerified) {
        this.certEquipmentVerified = certEquipmentVerified;
    }
    
    public Boolean getCertShiftEventsAccurate() {
        return certShiftEventsAccurate;
    }
    
    public void setCertShiftEventsAccurate(Boolean certShiftEventsAccurate) {
        this.certShiftEventsAccurate = certShiftEventsAccurate;
    }
    
    public Instant getCertificationDatetime() {
        return certificationDatetime;
    }
    
    public void setCertificationDatetime(Instant certificationDatetime) {
        this.certificationDatetime = certificationDatetime;
    }
    
    public String getReportCompletedBy() {
        return reportCompletedBy;
    }
    
    public void setReportCompletedBy(String reportCompletedBy) {
        this.reportCompletedBy = reportCompletedBy;
    }
    
    public String getReportCompletedByEmail() {
        return reportCompletedByEmail;
    }
    
    public void setReportCompletedByEmail(String reportCompletedByEmail) {
        this.reportCompletedByEmail = reportCompletedByEmail;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}

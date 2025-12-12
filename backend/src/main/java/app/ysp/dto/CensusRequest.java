package app.ysp.dto;

import java.time.LocalDate;
import java.util.List;

public class CensusRequest {
    private LocalDate censusDate;
    private String shift;
    private List<CensusEntryRequest> entries;
    private boolean sendEmail;

    public static class CensusEntryRequest {
        private Long residentId;
        private String residentName;
        private String status;
        private String comments;

        public Long getResidentId() { return residentId; }
        public void setResidentId(Long residentId) { this.residentId = residentId; }

        public String getResidentName() { return residentName; }
        public void setResidentName(String residentName) { this.residentName = residentName; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }

    public LocalDate getCensusDate() { return censusDate; }
    public void setCensusDate(LocalDate censusDate) { this.censusDate = censusDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public List<CensusEntryRequest> getEntries() { return entries; }
    public void setEntries(List<CensusEntryRequest> entries) { this.entries = entries; }

    public boolean isSendEmail() { return sendEmail; }
    public void setSendEmail(boolean sendEmail) { this.sendEmail = sendEmail; }
}

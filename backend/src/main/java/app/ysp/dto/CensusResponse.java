package app.ysp.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class CensusResponse {
    private Long id;
    private LocalDate censusDate;
    private String shift;
    private String conductedBy;
    private Integer totalResidents;
    private Integer dysCount;
    private Integer nonDysCount;
    private Instant createdAt;
    private List<CensusEntryResponse> entries;

    public static class CensusEntryResponse {
        private Long id;
        private Long residentId;
        private String residentName;
        private String status;
        private String comments;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getResidentId() { return residentId; }
        public void setResidentId(Long residentId) { this.residentId = residentId; }

        public String getResidentName() { return residentName; }
        public void setResidentName(String residentName) { this.residentName = residentName; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getCensusDate() { return censusDate; }
    public void setCensusDate(LocalDate censusDate) { this.censusDate = censusDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public String getConductedBy() { return conductedBy; }
    public void setConductedBy(String conductedBy) { this.conductedBy = conductedBy; }

    public Integer getTotalResidents() { return totalResidents; }
    public void setTotalResidents(Integer totalResidents) { this.totalResidents = totalResidents; }

    public Integer getDysCount() { return dysCount; }
    public void setDysCount(Integer dysCount) { this.dysCount = dysCount; }

    public Integer getNonDysCount() { return nonDysCount; }
    public void setNonDysCount(Integer nonDysCount) { this.nonDysCount = nonDysCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<CensusEntryResponse> getEntries() { return entries; }
    public void setEntries(List<CensusEntryResponse> entries) { this.entries = entries; }
}

package app.ysp.dto;

public class CompleteVisitationRequest {
    private String visitNotes;
    private Boolean incidentOccurred;
    private String incidentDetails;

    // Getters and Setters
    public String getVisitNotes() {
        return visitNotes;
    }

    public void setVisitNotes(String visitNotes) {
        this.visitNotes = visitNotes;
    }

    public Boolean getIncidentOccurred() {
        return incidentOccurred;
    }

    public void setIncidentOccurred(Boolean incidentOccurred) {
        this.incidentOccurred = incidentOccurred;
    }

    public String getIncidentDetails() {
        return incidentDetails;
    }

    public void setIncidentDetails(String incidentDetails) {
        this.incidentDetails = incidentDetails;
    }
}

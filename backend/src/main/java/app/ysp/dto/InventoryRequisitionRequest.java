package app.ysp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class InventoryRequisitionRequest {
    // Support for multiple items
    private List<RequisitionItem> items;
    
    private String priority;
    private String justification;
    private String additionalNotes;
    private BigDecimal estimatedCost;
    private String preferredVendor;
    private LocalDate requestDate;
    private List<String> ccEmails;
    
    // Inner class for individual items
    public static class RequisitionItem {
        private String itemName;
        private String category;
        private String quantityNeeded;
        private String unitOfMeasurement;
        
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getQuantityNeeded() { return quantityNeeded; }
        public void setQuantityNeeded(String quantityNeeded) { this.quantityNeeded = quantityNeeded; }
        
        public String getUnitOfMeasurement() { return unitOfMeasurement; }
        public void setUnitOfMeasurement(String unitOfMeasurement) { this.unitOfMeasurement = unitOfMeasurement; }
    }
    
    // Getters and Setters
    public List<RequisitionItem> getItems() {
        return items;
    }
    
    public void setItems(List<RequisitionItem> items) {
        this.items = items;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public String getJustification() {
        return justification;
    }
    
    public void setJustification(String justification) {
        this.justification = justification;
    }
    
    public String getAdditionalNotes() {
        return additionalNotes;
    }
    
    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
    
    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }
    
    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }
    
    public String getPreferredVendor() {
        return preferredVendor;
    }
    
    public void setPreferredVendor(String preferredVendor) {
        this.preferredVendor = preferredVendor;
    }
    
    public LocalDate getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }
    
    public List<String> getCcEmails() {
        return ccEmails;
    }
    
    public void setCcEmails(List<String> ccEmails) {
        this.ccEmails = ccEmails;
    }
}

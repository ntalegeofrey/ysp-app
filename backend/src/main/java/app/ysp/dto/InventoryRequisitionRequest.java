package app.ysp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InventoryRequisitionRequest {
    private String itemName;
    private String category;
    private Integer quantityRequested;
    private String unitOfMeasurement;
    private String priority;
    private String justification;
    private String additionalNotes;
    private BigDecimal estimatedCost;
    private String preferredVendor;
    private LocalDate requestDate;
    
    // Getters and Setters
    public String getItemName() {
        return itemName;
    }
    
    public void setItemName(String itemName) {
        this.itemName = itemName;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Integer getQuantityRequested() {
        return quantityRequested;
    }
    
    public void setQuantityRequested(Integer quantityRequested) {
        this.quantityRequested = quantityRequested;
    }
    
    public String getUnitOfMeasurement() {
        return unitOfMeasurement;
    }
    
    public void setUnitOfMeasurement(String unitOfMeasurement) {
        this.unitOfMeasurement = unitOfMeasurement;
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
}

package app.ysp.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class InventoryRequisitionResponse {
    private Long id;
    private Long programId;
    private String requisitionNumber;
    private String itemName;
    private String category;
    private Integer quantityRequested;
    private String unitOfMeasurement;
    private String priority;
    private String justification;
    private String additionalNotes;
    private BigDecimal estimatedCost;
    private String preferredVendor;
    private Long requestedBy;
    private String requestedByName;
    private LocalDate requestDate;
    private String status;
    private Long reviewedBy;
    private String reviewedByName;
    private Instant reviewDate;
    private String reviewNotes;
    private String rejectionReason;
    private Instant fulfilledDate;
    private BigDecimal actualCost;
    private String actualVendor;
    private Long inventoryItemId;
    private Instant createdAt;
    private Instant updatedAt;
    
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
    
    public String getRequisitionNumber() {
        return requisitionNumber;
    }
    
    public void setRequisitionNumber(String requisitionNumber) {
        this.requisitionNumber = requisitionNumber;
    }
    
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
    
    public Long getRequestedBy() {
        return requestedBy;
    }
    
    public void setRequestedBy(Long requestedBy) {
        this.requestedBy = requestedBy;
    }
    
    public String getRequestedByName() {
        return requestedByName;
    }
    
    public void setRequestedByName(String requestedByName) {
        this.requestedByName = requestedByName;
    }
    
    public LocalDate getRequestDate() {
        return requestDate;
    }
    
    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Long getReviewedBy() {
        return reviewedBy;
    }
    
    public void setReviewedBy(Long reviewedBy) {
        this.reviewedBy = reviewedBy;
    }
    
    public String getReviewedByName() {
        return reviewedByName;
    }
    
    public void setReviewedByName(String reviewedByName) {
        this.reviewedByName = reviewedByName;
    }
    
    public Instant getReviewDate() {
        return reviewDate;
    }
    
    public void setReviewDate(Instant reviewDate) {
        this.reviewDate = reviewDate;
    }
    
    public String getReviewNotes() {
        return reviewNotes;
    }
    
    public void setReviewNotes(String reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    public Instant getFulfilledDate() {
        return fulfilledDate;
    }
    
    public void setFulfilledDate(Instant fulfilledDate) {
        this.fulfilledDate = fulfilledDate;
    }
    
    public BigDecimal getActualCost() {
        return actualCost;
    }
    
    public void setActualCost(BigDecimal actualCost) {
        this.actualCost = actualCost;
    }
    
    public String getActualVendor() {
        return actualVendor;
    }
    
    public void setActualVendor(String actualVendor) {
        this.actualVendor = actualVendor;
    }
    
    public Long getInventoryItemId() {
        return inventoryItemId;
    }
    
    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
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
}

package app.ysp.dto;

import java.time.Instant;

public class InventoryTransactionResponse {
    private Long id;
    private Long programId;
    private Long inventoryItemId;
    private String itemName;
    private String category;
    private String transactionType;
    private Integer quantity;
    private Integer quantityBefore;
    private Integer quantityAfter;
    private Long staffId;
    private String staffName;
    private String purpose;
    private String recipientDepartment;
    private String notes;
    private Instant transactionDate;
    private Long requisitionId;
    
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
    
    public Long getInventoryItemId() {
        return inventoryItemId;
    }
    
    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
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
    
    public String getTransactionType() {
        return transactionType;
    }
    
    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Integer getQuantityBefore() {
        return quantityBefore;
    }
    
    public void setQuantityBefore(Integer quantityBefore) {
        this.quantityBefore = quantityBefore;
    }
    
    public Integer getQuantityAfter() {
        return quantityAfter;
    }
    
    public void setQuantityAfter(Integer quantityAfter) {
        this.quantityAfter = quantityAfter;
    }
    
    public Long getStaffId() {
        return staffId;
    }
    
    public void setStaffId(Long staffId) {
        this.staffId = staffId;
    }
    
    public String getStaffName() {
        return staffName;
    }
    
    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }
    
    public String getPurpose() {
        return purpose;
    }
    
    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }
    
    public String getRecipientDepartment() {
        return recipientDepartment;
    }
    
    public void setRecipientDepartment(String recipientDepartment) {
        this.recipientDepartment = recipientDepartment;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Instant getTransactionDate() {
        return transactionDate;
    }
    
    public void setTransactionDate(Instant transactionDate) {
        this.transactionDate = transactionDate;
    }
    
    public Long getRequisitionId() {
        return requisitionId;
    }
    
    public void setRequisitionId(Long requisitionId) {
        this.requisitionId = requisitionId;
    }
}

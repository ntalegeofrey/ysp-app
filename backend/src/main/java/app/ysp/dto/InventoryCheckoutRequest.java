package app.ysp.dto;

public class InventoryCheckoutRequest {
    private Long inventoryItemId;
    private Integer quantity;
    private String purpose;
    private String recipientDepartment;
    private String notes;
    
    // Getters and Setters
    public Long getInventoryItemId() {
        return inventoryItemId;
    }
    
    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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
}

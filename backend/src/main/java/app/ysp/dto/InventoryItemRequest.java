package app.ysp.dto;

public class InventoryItemRequest {
    private String itemName;
    private String category;
    private String description;
    private Integer quantity;
    private Integer minimumQuantity;
    private String unitOfMeasurement;
    private String location;
    private String storageZone;
    private String notes;
    
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public Integer getMinimumQuantity() {
        return minimumQuantity;
    }
    
    public void setMinimumQuantity(Integer minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }
    
    public String getUnitOfMeasurement() {
        return unitOfMeasurement;
    }
    
    public void setUnitOfMeasurement(String unitOfMeasurement) {
        this.unitOfMeasurement = unitOfMeasurement;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public String getStorageZone() {
        return storageZone;
    }
    
    public void setStorageZone(String storageZone) {
        this.storageZone = storageZone;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
}

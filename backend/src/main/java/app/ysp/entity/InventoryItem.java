package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    // Item Details
    @Column(name = "item_name", nullable = false)
    private String itemName;
    
    @Column(name = "category", nullable = false, length = 100)
    private String category;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Quantity Management
    @Column(name = "current_quantity", nullable = false)
    private Integer currentQuantity = 0;
    
    @Column(name = "minimum_quantity", nullable = false)
    private Integer minimumQuantity = 0;
    
    @Column(name = "unit_of_measurement", length = 50)
    private String unitOfMeasurement = "Units";
    
    // Storage
    @Column(name = "location")
    private String location;
    
    @Column(name = "storage_zone", length = 100)
    private String storageZone;
    
    // Status & Alerts
    @Column(name = "status", length = 50)
    private String status = "GOOD";
    
    @Column(name = "last_restocked_date")
    private Instant lastRestockedDate;
    
    // Metadata
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Program getProgram() {
        return program;
    }
    
    public void setProgram(Program program) {
        this.program = program;
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
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getCurrentQuantity() {
        return currentQuantity;
    }
    
    public void setCurrentQuantity(Integer currentQuantity) {
        this.currentQuantity = currentQuantity;
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
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Instant getLastRestockedDate() {
        return lastRestockedDate;
    }
    
    public void setLastRestockedDate(Instant lastRestockedDate) {
        this.lastRestockedDate = lastRestockedDate;
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
    
    public User getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}

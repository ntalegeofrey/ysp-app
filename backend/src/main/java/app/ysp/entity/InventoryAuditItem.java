package app.ysp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory_audit_items")
public class InventoryAuditItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_id", nullable = false)
    private InventoryAudit audit;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;
    
    @Column(name = "expected_quantity", nullable = false)
    private Integer expectedQuantity;
    
    @Column(name = "actual_quantity", nullable = false)
    private Integer actualQuantity;
    
    @Column(name = "discrepancy", nullable = false)
    private Integer discrepancy;
    
    @Column(name = "discrepancy_reason")
    private String discrepancyReason;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public InventoryAudit getAudit() {
        return audit;
    }
    
    public void setAudit(InventoryAudit audit) {
        this.audit = audit;
    }
    
    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }
    
    public void setInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItem = inventoryItem;
    }
    
    public Integer getExpectedQuantity() {
        return expectedQuantity;
    }
    
    public void setExpectedQuantity(Integer expectedQuantity) {
        this.expectedQuantity = expectedQuantity;
    }
    
    public Integer getActualQuantity() {
        return actualQuantity;
    }
    
    public void setActualQuantity(Integer actualQuantity) {
        this.actualQuantity = actualQuantity;
    }
    
    public Integer getDiscrepancy() {
        return discrepancy;
    }
    
    public void setDiscrepancy(Integer discrepancy) {
        this.discrepancy = discrepancy;
    }
    
    public String getDiscrepancyReason() {
        return discrepancyReason;
    }
    
    public void setDiscrepancyReason(String discrepancyReason) {
        this.discrepancyReason = discrepancyReason;
    }
}

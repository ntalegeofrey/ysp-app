package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory_transactions")
public class InventoryTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;
    
    // Transaction Details
    @Column(name = "transaction_type", nullable = false, length = 50)
    private String transactionType;
    
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
    
    @Column(name = "quantity_before", nullable = false)
    private Integer quantityBefore;
    
    @Column(name = "quantity_after", nullable = false)
    private Integer quantityAfter;
    
    // Staff & Purpose
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private User staff;
    
    @Column(name = "staff_name")
    private String staffName;
    
    @Column(name = "purpose", length = 100)
    private String purpose;
    
    @Column(name = "recipient_department")
    private String recipientDepartment;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Metadata
    @Column(name = "transaction_date")
    private Instant transactionDate;
    
    @Column(name = "requisition_id")
    private Long requisitionId;
    
    @PrePersist
    protected void onCreate() {
        if (transactionDate == null) {
            transactionDate = Instant.now();
        }
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
    
    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }
    
    public void setInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItem = inventoryItem;
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
    
    public User getStaff() {
        return staff;
    }
    
    public void setStaff(User staff) {
        this.staff = staff;
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

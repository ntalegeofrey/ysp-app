package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "inventory_requisitions")
public class InventoryRequisition {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;
    
    @Column(name = "requisition_number", nullable = false, unique = true, length = 50)
    private String requisitionNumber;
    
    // Item Request Details
    @Column(name = "item_name", nullable = false)
    private String itemName;
    
    @Column(name = "category", nullable = false, length = 100)
    private String category;
    
    @Column(name = "quantity_requested", nullable = false)
    private Integer quantityRequested;
    
    @Column(name = "unit_of_measurement", length = 50)
    private String unitOfMeasurement = "Units";
    
    // Priority & Justification
    @Column(name = "priority", nullable = false, length = 50)
    private String priority = "STANDARD";
    
    @Column(name = "justification", nullable = false, columnDefinition = "TEXT")
    private String justification;
    
    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;
    
    // Cost & Vendor
    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;
    
    @Column(name = "preferred_vendor")
    private String preferredVendor;
    
    // Requester
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private User requestedBy;
    
    @Column(name = "requested_by_name")
    private String requestedByName;
    
    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;
    
    // Approval Workflow
    @Column(name = "status", nullable = false, length = 50)
    private String status = "PENDING";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
    
    @Column(name = "reviewed_by_name")
    private String reviewedByName;
    
    @Column(name = "review_date")
    private Instant reviewDate;
    
    @Column(name = "review_notes", columnDefinition = "TEXT")
    private String reviewNotes;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    // Fulfillment
    @Column(name = "fulfilled_date")
    private Instant fulfilledDate;
    
    @Column(name = "actual_cost", precision = 10, scale = 2)
    private BigDecimal actualCost;
    
    @Column(name = "actual_vendor")
    private String actualVendor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inventory_item_id")
    private InventoryItem inventoryItem;
    
    // Metadata
    @Column(name = "created_at")
    private Instant createdAt;
    
    @Column(name = "updated_at")
    private Instant updatedAt;
    
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
    
    public User getRequestedBy() {
        return requestedBy;
    }
    
    public void setRequestedBy(User requestedBy) {
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
    
    public User getReviewedBy() {
        return reviewedBy;
    }
    
    public void setReviewedBy(User reviewedBy) {
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
    
    public InventoryItem getInventoryItem() {
        return inventoryItem;
    }
    
    public void setInventoryItem(InventoryItem inventoryItem) {
        this.inventoryItem = inventoryItem;
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

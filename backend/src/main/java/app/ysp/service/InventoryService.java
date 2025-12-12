package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.*;
import app.ysp.entity.*;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repository.InventoryItemRepository;
import app.ysp.repository.InventoryRequisitionRepository;
import app.ysp.repository.InventoryTransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryService {
    
    private final InventoryItemRepository itemRepository;
    private final InventoryTransactionRepository transactionRepository;
    private final InventoryRequisitionRepository requisitionRepository;
    private final ProgramRepository programRepository;
    private final ProgramAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final SseHub sseHub;
    private final MailService mailService;
    private final TemplateEngine templateEngine;
    
    public InventoryService(
            InventoryItemRepository itemRepository,
            InventoryTransactionRepository transactionRepository,
            InventoryRequisitionRepository requisitionRepository,
            ProgramRepository programRepository,
            ProgramAssignmentRepository assignmentRepository,
            UserRepository userRepository,
            SseHub sseHub,
            MailService mailService,
            TemplateEngine templateEngine) {
        this.itemRepository = itemRepository;
        this.transactionRepository = transactionRepository;
        this.requisitionRepository = requisitionRepository;
        this.programRepository = programRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.sseHub = sseHub;
        this.mailService = mailService;
        this.templateEngine = templateEngine;
    }
    
    // ========== INVENTORY ITEMS ==========
    
    /**
     * Add new item to inventory
     */
    @Transactional
    public InventoryItemResponse addItem(Long programId, InventoryItemRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        // Create inventory item
        InventoryItem item = new InventoryItem();
        item.setProgram(program);
        item.setItemName(request.getItemName());
        item.setCategory(request.getCategory());
        item.setDescription(request.getDescription());
        item.setCurrentQuantity(request.getQuantity() != null ? request.getQuantity() : 0);
        item.setMinimumQuantity(request.getMinimumQuantity() != null ? request.getMinimumQuantity() : 0);
        item.setUnitOfMeasurement(request.getUnitOfMeasurement() != null ? request.getUnitOfMeasurement() : "Units");
        item.setLocation(request.getLocation());
        item.setStorageZone(request.getStorageZone());
        item.setCreatedBy(staff);
        item.setLastRestockedDate(Instant.now());
        
        // Calculate status
        item.setStatus(calculateStatus(item.getCurrentQuantity(), item.getMinimumQuantity()));
        
        item = itemRepository.save(item);
        
        // Create transaction log
        if (request.getQuantity() != null && request.getQuantity() > 0) {
            createTransaction(item, "ADDITION", request.getQuantity(), staff, "Initial stock", request.getNotes());
        }
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.item_added",
                "programId", programId,
                "itemId", item.getId()
            ));
        } catch (Exception ignored) {}
        
        return mapItemToResponse(item);
    }
    
    /**
     * Get all inventory items for a program
     */
    public List<InventoryItemResponse> getAllItems(Long programId) {
        List<InventoryItem> items = itemRepository.findByProgramId(programId);
        return items.stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get items with filtering and pagination
     */
    public Map<String, Object> filterItems(Long programId, String category, String status,
                                          String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryItem> itemPage = itemRepository.filterItems(programId, category, status, searchTerm, pageable);
        
        List<InventoryItemResponse> items = itemPage.getContent().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", items);
        response.put("totalPages", itemPage.getTotalPages());
        response.put("totalElements", itemPage.getTotalElements());
        response.put("currentPage", itemPage.getNumber());
        return response;
    }
    
    /**
     * Get single item by ID
     */
    public InventoryItemResponse getItemById(Long programId, Long itemId) {
        InventoryItem item = itemRepository.findByIdAndProgramId(itemId, programId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return mapItemToResponse(item);
    }
    
    /**
     * Update inventory item
     */
    @Transactional
    public InventoryItemResponse updateItem(Long programId, Long itemId, InventoryItemRequest request, Long staffId) {
        InventoryItem item = itemRepository.findByIdAndProgramId(itemId, programId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        int oldQuantity = item.getCurrentQuantity();
        
        item.setItemName(request.getItemName());
        item.setCategory(request.getCategory());
        item.setDescription(request.getDescription());
        item.setMinimumQuantity(request.getMinimumQuantity() != null ? request.getMinimumQuantity() : item.getMinimumQuantity());
        item.setUnitOfMeasurement(request.getUnitOfMeasurement() != null ? request.getUnitOfMeasurement() : item.getUnitOfMeasurement());
        item.setLocation(request.getLocation());
        item.setStorageZone(request.getStorageZone());
        
        // If quantity changed, create transaction
        if (request.getQuantity() != null && !request.getQuantity().equals(oldQuantity)) {
            int difference = request.getQuantity() - oldQuantity;
            item.setCurrentQuantity(request.getQuantity());
            item.setLastRestockedDate(Instant.now());
            
            createTransaction(item, difference > 0 ? "ADDITION" : "ADJUSTMENT", 
                            difference, staff, "Manual adjustment", request.getNotes());
        }
        
        // Recalculate status
        item.setStatus(calculateStatus(item.getCurrentQuantity(), item.getMinimumQuantity()));
        
        item = itemRepository.save(item);
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.item_updated",
                "programId", programId,
                "itemId", item.getId()
            ));
        } catch (Exception ignored) {}
        
        return mapItemToResponse(item);
    }
    
    // ========== CHECKOUT ==========
    
    /**
     * Checkout items from inventory
     */
    @Transactional
    public InventoryTransactionResponse checkoutItem(Long programId, InventoryCheckoutRequest request, Long staffId) {
        InventoryItem item = itemRepository.findByIdAndProgramId(request.getInventoryItemId(), programId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        // Validate quantity
        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }
        
        if (request.getQuantity() > item.getCurrentQuantity()) {
            throw new RuntimeException("Insufficient quantity available");
        }
        
        // Update item quantity
        int oldQuantity = item.getCurrentQuantity();
        item.setCurrentQuantity(oldQuantity - request.getQuantity());
        
        // Recalculate status
        item.setStatus(calculateStatus(item.getCurrentQuantity(), item.getMinimumQuantity()));
        
        itemRepository.save(item);
        
        // Create transaction
        InventoryTransaction transaction = createTransaction(
            item, "CHECKOUT", -request.getQuantity(), staff, 
            request.getPurpose(), request.getNotes()
        );
        transaction.setRecipientDepartment(request.getRecipientDepartment());
        transaction = transactionRepository.save(transaction);
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.item_checkout",
                "programId", programId,
                "itemId", item.getId(),
                "quantity", request.getQuantity()
            ));
        } catch (Exception ignored) {}
        
        return mapTransactionToResponse(transaction);
    }
    
    // ========== TRANSACTIONS (LOG) ==========
    
    /**
     * Get transaction history with filtering
     */
    public Map<String, Object> getTransactionHistory(Long programId, String transactionType,
                                                     String category, String searchTerm,
                                                     int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryTransaction> transactionPage = transactionRepository.filterTransactions(
            programId, transactionType, category, searchTerm, pageable);
        
        List<InventoryTransactionResponse> transactions = transactionPage.getContent().stream()
                .map(this::mapTransactionToResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", transactions);
        response.put("totalPages", transactionPage.getTotalPages());
        response.put("totalElements", transactionPage.getTotalElements());
        response.put("currentPage", transactionPage.getNumber());
        return response;
    }
    
    // ========== REQUISITIONS ==========
    
    /**
     * Create new requisition - supports multiple items
     */
    @Transactional
    public InventoryRequisitionResponse createRequisition(Long programId, InventoryRequisitionRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        // Generate base requisition number for this batch
        String baseRequisitionNumber = generateRequisitionNumber();
        List<InventoryRequisition> requisitions = new java.util.ArrayList<>();
        
        // Create a requisition for each item
        for (int i = 0; i < request.getItems().size(); i++) {
            InventoryRequisitionRequest.RequisitionItem item = request.getItems().get(i);
            
            // Generate requisition number (base-001, base-002, etc for multiple items)
            String requisitionNumber = request.getItems().size() > 1 
                ? baseRequisitionNumber + "-" + String.format("%02d", i + 1)
                : baseRequisitionNumber;
            
            // Parse quantity safely
            Integer quantityRequested = 1; // Default to 1
            try {
                if (item.getQuantityNeeded() != null && !item.getQuantityNeeded().trim().isEmpty()) {
                    quantityRequested = Integer.parseInt(item.getQuantityNeeded().trim());
                }
            } catch (NumberFormatException e) {
                quantityRequested = 1;
            }
            
            InventoryRequisition requisition = new InventoryRequisition();
            requisition.setProgram(program);
            requisition.setRequisitionNumber(requisitionNumber);
            requisition.setItemName(item.getItemName());
            requisition.setCategory(item.getCategory());
            requisition.setQuantityRequested(quantityRequested);
            requisition.setUnitOfMeasurement(item.getUnitOfMeasurement() != null ? item.getUnitOfMeasurement() : "Units");
            requisition.setPriority(request.getPriority() != null ? request.getPriority() : "STANDARD");
            requisition.setJustification(request.getJustification());
            requisition.setAdditionalNotes(request.getAdditionalNotes());
            requisition.setEstimatedCost(request.getEstimatedCost());
            requisition.setPreferredVendor(request.getPreferredVendor());
            requisition.setRequestedBy(staff);
            requisition.setRequestedByName(staff.getFirstName() + " " + staff.getLastName());
            requisition.setRequestDate(request.getRequestDate() != null ? request.getRequestDate() : LocalDate.now());
            requisition.setStatus("PENDING");
            
            requisitions.add(requisitionRepository.save(requisition));
        }
        
        // Send single email with all items
        sendRequisitionEmailsMultiple(program, requisitions, request);
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.requisition_created",
                "programId", programId,
                "requisitionNumber", baseRequisitionNumber,
                "itemCount", requisitions.size()
            ));
        } catch (Exception ignored) {}
        
        // Return the first requisition (or we could return a list)
        return mapRequisitionToResponse(requisitions.get(0));
    }
    
    /**
     * Get requisitions with filtering
     */
    public Map<String, Object> getRequisitions(Long programId, String status, String category,
                                               String priority, String searchTerm,
                                               int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InventoryRequisition> requisitionPage = requisitionRepository.filterRequisitions(
            programId, status, category, priority, searchTerm, pageable);
        
        List<InventoryRequisitionResponse> requisitions = requisitionPage.getContent().stream()
                .map(this::mapRequisitionToResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", requisitions);
        response.put("totalPages", requisitionPage.getTotalPages());
        response.put("totalElements", requisitionPage.getTotalElements());
        response.put("currentPage", requisitionPage.getNumber());
        
        // Add status counts
        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("PENDING", requisitionRepository.countByProgramIdAndStatus(programId, "PENDING"));
        statusCounts.put("UNDER_REVIEW", requisitionRepository.countByProgramIdAndStatus(programId, "UNDER_REVIEW"));
        statusCounts.put("APPROVED", requisitionRepository.countByProgramIdAndStatus(programId, "APPROVED"));
        statusCounts.put("REJECTED", requisitionRepository.countByProgramIdAndStatus(programId, "REJECTED"));
        response.put("statusCounts", statusCounts);
        
        return response;
    }
    
    /**
     * Review requisition (approve/reject)
     */
    @Transactional
    public InventoryRequisitionResponse reviewRequisition(Long programId, Long requisitionId,
                                                         String action, String notes, Long staffId) {
        InventoryRequisition requisition = requisitionRepository.findByIdAndProgramId(requisitionId, programId)
                .orElseThrow(() -> new RuntimeException("Requisition not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        requisition.setReviewedBy(staff);
        requisition.setReviewedByName(staff.getFirstName() + " " + staff.getLastName());
        requisition.setReviewDate(Instant.now());
        requisition.setReviewNotes(notes);
        
        if ("APPROVE".equalsIgnoreCase(action)) {
            requisition.setStatus("APPROVED");
        } else if ("REJECT".equalsIgnoreCase(action)) {
            requisition.setStatus("REJECTED");
            requisition.setRejectionReason(notes);
        } else {
            throw new RuntimeException("Invalid action. Must be APPROVE or REJECT");
        }
        
        requisition = requisitionRepository.save(requisition);
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.requisition_reviewed",
                "programId", programId,
                "requisitionId", requisition.getId(),
                "status", requisition.getStatus()
            ));
        } catch (Exception ignored) {}
        
        return mapRequisitionToResponse(requisition);
    }
    
    /**
     * Update requisition status (UNDER_REVIEW, APPROVED, DECLINED)
     * Send email notification to PD and AsstPD
     */
    @Transactional
    public InventoryRequisitionResponse updateRequisitionStatus(Long programId, Long requisitionId,
                                                                 String newStatus, String remarks, Long staffId) {
        InventoryRequisition requisition = requisitionRepository.findByIdAndProgramId(requisitionId, programId)
                .orElseThrow(() -> new RuntimeException("Requisition not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        // Validate status
        if (!newStatus.matches("UNDER_REVIEW|APPROVED|DECLINED")) {
            throw new RuntimeException("Invalid status. Must be UNDER_REVIEW, APPROVED, or DECLINED");
        }
        
        String oldStatus = requisition.getStatus();
        requisition.setStatus(newStatus);
        requisition.setReviewedBy(staff);
        requisition.setReviewedByName(staff.getFirstName() + " " + staff.getLastName());
        requisition.setReviewDate(Instant.now());
        if (remarks != null && !remarks.isBlank()) {
            requisition.setReviewNotes(remarks);
        }
        
        requisition = requisitionRepository.save(requisition);
        
        // Send email notifications to PD and AsstPD
        sendStatusChangeEmails(program, requisition, oldStatus, newStatus, staff, remarks);
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.requisition_status_updated",
                "programId", programId,
                "requisitionId", requisition.getId(),
                "status", requisition.getStatus()
            ));
        } catch (Exception ignored) {}
        
        return mapRequisitionToResponse(requisition);
    }
    
    // ========== STATS & DASHBOARD ==========
    
    /**
     * Get inventory statistics
     */
    public Map<String, Object> getInventoryStats(Long programId) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalItems", itemRepository.countByProgramId(programId));
        stats.put("lowStockCount", itemRepository.countByProgramIdAndStatus(programId, "LOW"));
        stats.put("criticalStockCount", itemRepository.countByProgramIdAndStatus(programId, "CRITICAL"));
        stats.put("outOfStockCount", itemRepository.countByProgramIdAndStatus(programId, "OUT_OF_STOCK"));
        
        // Get low stock items
        List<InventoryItem> lowStockItems = itemRepository.findLowStockItems(programId);
        stats.put("lowStockItems", lowStockItems.stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList()));
        
        // Get critical stock items
        List<InventoryItem> criticalItems = itemRepository.findCriticalStockItems(programId);
        stats.put("criticalItems", criticalItems.stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList()));
        
        return stats;
    }
    
    // ========== HELPER METHODS ==========
    
    private InventoryTransaction createTransaction(InventoryItem item, String type, Integer quantity,
                                                   User staff, String purpose, String notes) {
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setProgram(item.getProgram());
        transaction.setInventoryItem(item);
        transaction.setTransactionType(type);
        transaction.setQuantity(quantity);
        transaction.setQuantityBefore(item.getCurrentQuantity() - quantity);
        transaction.setQuantityAfter(item.getCurrentQuantity());
        transaction.setStaff(staff);
        transaction.setStaffName(staff.getFirstName() + " " + staff.getLastName());
        transaction.setPurpose(purpose);
        transaction.setNotes(notes);
        
        return transactionRepository.save(transaction);
    }
    
    private String calculateStatus(Integer currentQuantity, Integer minimumQuantity) {
        if (currentQuantity == 0) {
            return "OUT_OF_STOCK";
        } else if (currentQuantity <= (minimumQuantity * 0.5)) {
            return "CRITICAL";
        } else if (currentQuantity < minimumQuantity) {
            return "LOW";
        } else {
            return "GOOD";
        }
    }
    
    private String generateRequisitionNumber() {
        int year = LocalDate.now().getYear();
        String pattern = "REQ-" + year + "-%";
        Integer maxNumber = requisitionRepository.findMaxRequisitionNumberForYear(pattern);
        int nextNumber = (maxNumber != null ? maxNumber : 0) + 1;
        return String.format("REQ-%d-%03d", year, nextNumber);
    }
    
    // ========== MAPPERS ==========
    
    private InventoryItemResponse mapItemToResponse(InventoryItem item) {
        InventoryItemResponse response = new InventoryItemResponse();
        response.setId(item.getId());
        response.setProgramId(item.getProgram().getId());
        response.setItemName(item.getItemName());
        response.setCategory(item.getCategory());
        response.setDescription(item.getDescription());
        response.setCurrentQuantity(item.getCurrentQuantity());
        response.setMinimumQuantity(item.getMinimumQuantity());
        response.setUnitOfMeasurement(item.getUnitOfMeasurement());
        response.setLocation(item.getLocation());
        response.setStorageZone(item.getStorageZone());
        response.setStatus(item.getStatus());
        response.setLastRestockedDate(item.getLastRestockedDate());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());
        
        if (item.getCreatedBy() != null) {
            response.setCreatedBy(item.getCreatedBy().getId());
            response.setCreatedByName(item.getCreatedBy().getFirstName() + " " + item.getCreatedBy().getLastName());
        }
        
        return response;
    }
    
    private InventoryTransactionResponse mapTransactionToResponse(InventoryTransaction transaction) {
        InventoryTransactionResponse response = new InventoryTransactionResponse();
        response.setId(transaction.getId());
        response.setProgramId(transaction.getProgram().getId());
        response.setInventoryItemId(transaction.getInventoryItem().getId());
        response.setItemName(transaction.getInventoryItem().getItemName());
        response.setCategory(transaction.getInventoryItem().getCategory());
        response.setTransactionType(transaction.getTransactionType());
        response.setQuantity(transaction.getQuantity());
        response.setQuantityBefore(transaction.getQuantityBefore());
        response.setQuantityAfter(transaction.getQuantityAfter());
        response.setStaffId(transaction.getStaff().getId());
        response.setStaffName(transaction.getStaffName());
        response.setPurpose(transaction.getPurpose());
        response.setRecipientDepartment(transaction.getRecipientDepartment());
        response.setNotes(transaction.getNotes());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setRequisitionId(transaction.getRequisitionId());
        
        return response;
    }
    
    private InventoryRequisitionResponse mapRequisitionToResponse(InventoryRequisition requisition) {
        InventoryRequisitionResponse response = new InventoryRequisitionResponse();
        response.setId(requisition.getId());
        response.setProgramId(requisition.getProgram().getId());
        response.setRequisitionNumber(requisition.getRequisitionNumber());
        response.setItemName(requisition.getItemName());
        response.setCategory(requisition.getCategory());
        response.setQuantityRequested(requisition.getQuantityRequested());
        response.setUnitOfMeasurement(requisition.getUnitOfMeasurement());
        response.setPriority(requisition.getPriority());
        response.setJustification(requisition.getJustification());
        response.setAdditionalNotes(requisition.getAdditionalNotes());
        response.setEstimatedCost(requisition.getEstimatedCost());
        response.setPreferredVendor(requisition.getPreferredVendor());
        response.setRequestedBy(requisition.getRequestedBy().getId());
        response.setRequestedByName(requisition.getRequestedByName());
        response.setRequestDate(requisition.getRequestDate());
        response.setStatus(requisition.getStatus());
        
        if (requisition.getReviewedBy() != null) {
            response.setReviewedBy(requisition.getReviewedBy().getId());
            response.setReviewedByName(requisition.getReviewedByName());
        }
        
        response.setReviewDate(requisition.getReviewDate());
        response.setReviewNotes(requisition.getReviewNotes());
        response.setRejectionReason(requisition.getRejectionReason());
        response.setFulfilledDate(requisition.getFulfilledDate());
        response.setActualCost(requisition.getActualCost());
        response.setActualVendor(requisition.getActualVendor());
        
        if (requisition.getInventoryItem() != null) {
            response.setInventoryItemId(requisition.getInventoryItem().getId());
        }
        
        response.setCreatedAt(requisition.getCreatedAt());
        response.setUpdatedAt(requisition.getUpdatedAt());
        
        return response;
    }
    
    /**
     * Send email notifications for new requisition to PD, APD, Regional Director, and CC list
     */
    private void sendRequisitionEmails(Program program, InventoryRequisition requisition, InventoryRequisitionRequest request) {
        try {
            // Collect all recipient emails using ProgramAssignment (same as UCR notifications)
            java.util.Set<String> recipients = new java.util.HashSet<>();
            
            // Find PD and Assistant Director assignments for this program
            java.util.List<ProgramAssignment> assignments = assignmentRepository.findByProgram_Id(program.getId());
            for (ProgramAssignment pa : assignments) {
                if (pa.getUserEmail() == null || pa.getUserEmail().isBlank()) continue;
                String role = pa.getRoleType() != null ? pa.getRoleType().toUpperCase() : "";
                if ("PROGRAM_DIRECTOR".equals(role) || "ASSISTANT_DIRECTOR".equals(role)) {
                    recipients.add(pa.getUserEmail());
                }
            }
            
            // Also check program entity fields as fallback
            if (program.getProgramDirectorEmail() != null && !program.getProgramDirectorEmail().isBlank()) {
                recipients.add(program.getProgramDirectorEmail());
            }
            if (program.getAssistantDirectorEmail() != null && !program.getAssistantDirectorEmail().isBlank()) {
                recipients.add(program.getAssistantDirectorEmail());
            }
            if (program.getRegionalAdminEmail() != null && !program.getRegionalAdminEmail().isBlank()) {
                recipients.add(program.getRegionalAdminEmail());
            }
            
            // Add CC emails from request
            if (request.getCcEmails() != null) {
                for (String email : request.getCcEmails()) {
                    if (email != null && !email.isBlank()) {
                        recipients.add(email.trim());
                    }
                }
            }
            
            if (recipients.isEmpty()) {
                System.out.println("[WARN] No email recipients found for requisition notification");
                return;
            }
            
            // Build email using template
            String subject = "New Inventory Requisition #" + requisition.getRequisitionNumber() + 
                            " - " + requisition.getPriority() + " Priority";
            
            // Determine priority color
            String priorityColor = "URGENT".equalsIgnoreCase(requisition.getPriority()) ? "#ff6b35" :
                                   "EMERGENCY".equalsIgnoreCase(requisition.getPriority()) ? "#dc2626" : "#10b981";
            
            // Build items rows HTML (single item)
            String itemsRows = "<tr style=\"background:#ffffff;\">" +
                    "<td style=\"padding:10px;color:#1f2937;font-size:14px;font-weight:600;\">" + requisition.getItemName() + "</td>" +
                    "<td style=\"padding:10px;color:#6b7280;font-size:14px;\">" + requisition.getCategory() + "</td>" +
                    "<td style=\"padding:10px;text-align:right;color:#1f2937;font-size:14px;\">" + requisition.getQuantityRequested() + " " + requisition.getUnitOfMeasurement() + "</td>" +
                    "</tr>";
            
            // Build details rows HTML
            StringBuilder detailsRows = new StringBuilder();
            if (requisition.getEstimatedCost() != null) {
                detailsRows.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;width:35%;\"><strong>Estimated Cost:</strong></td>");
                detailsRows.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">$").append(requisition.getEstimatedCost()).append("</td></tr>");
            }
            if (requisition.getPreferredVendor() != null && !requisition.getPreferredVendor().isBlank()) {
                detailsRows.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Preferred Vendor:</strong></td>");
                detailsRows.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(requisition.getPreferredVendor()).append("</td></tr>");
            }
            detailsRows.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;\"><strong>Requested By:</strong></td>");
            detailsRows.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">").append(requisition.getRequestedByName()).append("</td></tr>");
            detailsRows.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Request Date:</strong></td>");
            detailsRows.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(requisition.getRequestDate()).append("</td></tr>");
            
            // Prepare template context
            Context context = new Context();
            context.setVariable("programName", program.getName());
            context.setVariable("priority", requisition.getPriority());
            context.setVariable("priorityColor", priorityColor);
            context.setVariable("requisitionNumber", requisition.getRequisitionNumber());
            context.setVariable("itemsRows", itemsRows);
            context.setVariable("detailsRows", detailsRows.toString());
            context.setVariable("justification", requisition.getJustification() != null ? requisition.getJustification().replace("\n", "<br/>") : "");
            context.setVariable("currentYear", java.time.Year.now().getValue());
            
            // Render template
            String html = templateEngine.process("requisition-notification", context);
            
            // Send to all recipients
            for (String email : recipients) {
                mailService.sendRawHtml(email, subject, html);
                System.out.println("[INFO] Sent requisition notification email to: " + email);
            }
            
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send requisition emails: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send email notifications for multiple items in one requisition to PD, APD, Regional Director, and CC list
     */
    private void sendRequisitionEmailsMultiple(Program program, List<InventoryRequisition> requisitions, InventoryRequisitionRequest request) {
        try {
            // Collect all recipient emails using ProgramAssignment (same as UCR notifications)
            java.util.Set<String> recipients = new java.util.HashSet<>();
            
            // Find PD and Assistant Director assignments for this program
            java.util.List<ProgramAssignment> assignments = assignmentRepository.findByProgram_Id(program.getId());
            for (ProgramAssignment pa : assignments) {
                if (pa.getUserEmail() == null || pa.getUserEmail().isBlank()) continue;
                String role = pa.getRoleType() != null ? pa.getRoleType().toUpperCase() : "";
                if ("PROGRAM_DIRECTOR".equals(role) || "ASSISTANT_DIRECTOR".equals(role)) {
                    recipients.add(pa.getUserEmail());
                }
            }
            
            // Also check program entity fields as fallback
            if (program.getProgramDirectorEmail() != null && !program.getProgramDirectorEmail().isBlank()) {
                recipients.add(program.getProgramDirectorEmail());
            }
            if (program.getAssistantDirectorEmail() != null && !program.getAssistantDirectorEmail().isBlank()) {
                recipients.add(program.getAssistantDirectorEmail());
            }
            if (program.getRegionalAdminEmail() != null && !program.getRegionalAdminEmail().isBlank()) {
                recipients.add(program.getRegionalAdminEmail());
            }
            
            // Add CC emails from request
            if (request.getCcEmails() != null) {
                for (String email : request.getCcEmails()) {
                    if (email != null && !email.isBlank()) {
                        recipients.add(email.trim());
                    }
                }
            }
            
            if (recipients.isEmpty()) {
                System.out.println("[WARN] No email recipients found for requisition notification");
                return;
            }
            
            InventoryRequisition firstReq = requisitions.get(0);
            String baseNumber = firstReq.getRequisitionNumber().replaceAll("-\\d+$", "");
            
            // Build email subject
            String subject = "New Inventory Requisition #" + baseNumber + 
                            " (" + requisitions.size() + " item" + (requisitions.size() > 1 ? "s" : "") + ") - " + 
                            firstReq.getPriority() + " Priority";
            
            // Determine priority color
            String priorityColor = "URGENT".equalsIgnoreCase(firstReq.getPriority()) ? "#ff6b35" :
                                   "EMERGENCY".equalsIgnoreCase(firstReq.getPriority()) ? "#dc2626" : "#10b981";
            
            // Build items rows HTML
            StringBuilder itemsRows = new StringBuilder();
            for (int i = 0; i < requisitions.size(); i++) {
                InventoryRequisition req = requisitions.get(i);
                String bgColor = i % 2 == 0 ? "#ffffff" : "#f9fafb";
                itemsRows.append("<tr style=\"background:").append(bgColor).append(";\">");
                itemsRows.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;font-weight:600;\">").append(req.getItemName()).append("</td>");
                itemsRows.append("<td style=\"padding:10px;color:#6b7280;font-size:14px;\">").append(req.getCategory()).append("</td>");
                itemsRows.append("<td style=\"padding:10px;text-align:right;color:#1f2937;font-size:14px;\">").append(req.getQuantityRequested()).append(" ").append(req.getUnitOfMeasurement()).append("</td>");
                itemsRows.append("</tr>");
            }
            
            // Build details rows HTML
            StringBuilder detailsRows = new StringBuilder();
            if (firstReq.getEstimatedCost() != null) {
                detailsRows.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;width:35%;\"><strong>Estimated Cost:</strong></td>");
                detailsRows.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">$").append(firstReq.getEstimatedCost()).append("</td></tr>");
            }
            if (firstReq.getPreferredVendor() != null && !firstReq.getPreferredVendor().isBlank()) {
                detailsRows.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Preferred Vendor:</strong></td>");
                detailsRows.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(firstReq.getPreferredVendor()).append("</td></tr>");
            }
            detailsRows.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;\"><strong>Requested By:</strong></td>");
            detailsRows.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">").append(firstReq.getRequestedByName()).append("</td></tr>");
            detailsRows.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Request Date:</strong></td>");
            detailsRows.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(firstReq.getRequestDate()).append("</td></tr>");
            
            // Prepare template context
            Context context = new Context();
            context.setVariable("programName", program.getName());
            context.setVariable("priority", firstReq.getPriority());
            context.setVariable("priorityColor", priorityColor);
            context.setVariable("requisitionNumber", baseNumber);
            context.setVariable("itemsRows", itemsRows.toString());
            context.setVariable("detailsRows", detailsRows.toString());
            context.setVariable("justification", firstReq.getJustification() != null ? firstReq.getJustification().replace("\n", "<br/>") : "");
            context.setVariable("currentYear", java.time.Year.now().getValue());
            
            // Render template
            String html = templateEngine.process("requisition-notification", context);
            
            // Send to all recipients
            for (String email : recipients) {
                mailService.sendRawHtml(email, subject, html);
                System.out.println("[INFO] Sent multi-item requisition notification email to: " + email);
            }
            
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send requisition emails: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Send status change notification emails to PD and AsstPD
     */
    private void sendStatusChangeEmails(Program program, InventoryRequisition requisition,
                                        String oldStatus, String newStatus, User actionBy, String remarks) {
        try {
            // Collect PD and AsstPD emails using ProgramAssignment
            java.util.Set<String> recipients = new java.util.HashSet<>();
            
            java.util.List<ProgramAssignment> assignments = assignmentRepository.findByProgram_Id(program.getId());
            for (ProgramAssignment pa : assignments) {
                if (pa.getUserEmail() == null || pa.getUserEmail().isBlank()) continue;
                String role = pa.getRoleType() != null ? pa.getRoleType().toUpperCase() : "";
                if ("PROGRAM_DIRECTOR".equals(role) || "ASSISTANT_DIRECTOR".equals(role)) {
                    recipients.add(pa.getUserEmail());
                }
            }
            
            // Fallback to program entity fields
            if (program.getProgramDirectorEmail() != null && !program.getProgramDirectorEmail().isBlank()) {
                recipients.add(program.getProgramDirectorEmail());
            }
            if (program.getAssistantDirectorEmail() != null && !program.getAssistantDirectorEmail().isBlank()) {
                recipients.add(program.getAssistantDirectorEmail());
            }
            
            if (recipients.isEmpty()) {
                System.out.println("[WARN] No PD/AsstPD email recipients for status change notification");
                return;
            }
            
            // Determine status color
            String statusColor = switch (newStatus) {
                case "APPROVED" -> "#10b981";
                case "DECLINED" -> "#dc2626";
                case "UNDER_REVIEW" -> "#f59e0b";
                default -> "#6b7280";
            };
            
            // Build email subject
            String subject = "Requisition Status Update: " + requisition.getRequisitionNumber() + " - " + newStatus;
            
            // Prepare template context
            Context context = new Context();
            context.setVariable("programName", program.getName());
            context.setVariable("requisitionNumber", requisition.getRequisitionNumber());
            context.setVariable("itemName", requisition.getItemName());
            context.setVariable("oldStatus", oldStatus);
            context.setVariable("newStatus", newStatus);
            context.setVariable("statusColor", statusColor);
            context.setVariable("actionBy", actionBy.getFirstName() + " " + actionBy.getLastName());
            context.setVariable("actionDate", LocalDate.now().toString());
            context.setVariable("remarks", remarks);
            context.setVariable("currentYear", java.time.Year.now().getValue());
            
            // Render template
            String html = templateEngine.process("requisition-status-notification", context);
            
            // Send emails
            for (String email : recipients) {
                mailService.sendRawHtml(email, subject, html);
                System.out.println("[INFO] Sent status change notification to: " + email);
            }
            
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send status change emails: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
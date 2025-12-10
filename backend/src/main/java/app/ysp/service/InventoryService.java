package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.*;
import app.ysp.entity.*;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repository.InventoryItemRepository;
import app.ysp.repository.InventoryRequisitionRepository;
import app.ysp.repository.InventoryTransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserRepository userRepository;
    private final SseHub sseHub;
    private final MailService mailService;
    
    public InventoryService(
            InventoryItemRepository itemRepository,
            InventoryTransactionRepository transactionRepository,
            InventoryRequisitionRepository requisitionRepository,
            ProgramRepository programRepository,
            UserRepository userRepository,
            SseHub sseHub,
            MailService mailService) {
        this.itemRepository = itemRepository;
        this.transactionRepository = transactionRepository;
        this.requisitionRepository = requisitionRepository;
        this.programRepository = programRepository;
        this.userRepository = userRepository;
        this.sseHub = sseHub;
        this.mailService = mailService;
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
     * Create new requisition
     */
    @Transactional
    public InventoryRequisitionResponse createRequisition(Long programId, InventoryRequisitionRequest request, Long staffId) {
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));
        
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
        
        // Generate requisition number
        String requisitionNumber = generateRequisitionNumber();
        
        InventoryRequisition requisition = new InventoryRequisition();
        requisition.setProgram(program);
        requisition.setRequisitionNumber(requisitionNumber);
        requisition.setItemName(request.getItemName());
        requisition.setCategory(request.getCategory());
        requisition.setQuantityRequested(request.getQuantityRequested());
        requisition.setUnitOfMeasurement(request.getUnitOfMeasurement() != null ? request.getUnitOfMeasurement() : "Units");
        requisition.setPriority(request.getPriority() != null ? request.getPriority() : "STANDARD");
        requisition.setJustification(request.getJustification());
        requisition.setAdditionalNotes(request.getAdditionalNotes());
        requisition.setEstimatedCost(request.getEstimatedCost());
        requisition.setPreferredVendor(request.getPreferredVendor());
        requisition.setRequestedBy(staff);
        requisition.setRequestedByName(staff.getFirstName() + " " + staff.getLastName());
        requisition.setRequestDate(request.getRequestDate() != null ? request.getRequestDate() : LocalDate.now());
        requisition.setStatus("PENDING");
        
        requisition = requisitionRepository.save(requisition);
        
        // Send email notifications
        sendRequisitionEmails(program, requisition, request);
        
        // Broadcast SSE
        try {
            sseHub.broadcast(Map.of(
                "type", "inventory.requisition_created",
                "programId", programId,
                "requisitionId", requisition.getId()
            ));
        } catch (Exception ignored) {}
        
        return mapRequisitionToResponse(requisition);
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
        InventoryRequisition requisition = requisitionRepository.findByIdAndProgram_Id(requisitionId, programId)
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
            // Collect all recipient emails
            java.util.Set<String> recipients = new java.util.HashSet<>();
            
            // Add Program Director
            if (program.getProgramDirectorEmail() != null && !program.getProgramDirectorEmail().isBlank()) {
                recipients.add(program.getProgramDirectorEmail());
            }
            
            // Add Assistant Program Director
            if (program.getAssistantDirectorEmail() != null && !program.getAssistantDirectorEmail().isBlank()) {
                recipients.add(program.getAssistantDirectorEmail());
            }
            
            // Add Regional Director
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
            
            // Build email HTML with DYS logo and professional template
            String subject = "New Inventory Requisition #" + requisition.getRequisitionNumber() + 
                            " - " + requisition.getPriority() + " Priority";
            
            StringBuilder html = new StringBuilder();
            html.append("<!DOCTYPE html>");
            html.append("<html><head><meta charset=\"UTF-8\"></head><body style=\"margin:0;padding:0;font-family:Arial,sans-serif;\">");
            html.append("<div style=\"max-width:650px;margin:20px auto;background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;\">");
            
            // Header with DYS Logo
            html.append("<div style=\"background:linear-gradient(135deg, #0046AD 0%, #003d96 100%);padding:30px;text-align:center;border-radius:8px 8px 0 0;\">");
            html.append("<img src=\"https://dys.ohio.gov/static/logo/dys-logo-white.png\" alt=\"DYS Logo\" style=\"height:60px;margin-bottom:10px;\"/>");
            html.append("<h1 style=\"color:#ffffff;margin:10px 0 5px 0;font-size:24px;font-weight:600;\">New Inventory Requisition</h1>");
            html.append("<p style=\"color:#e3f2ff;margin:0;font-size:14px;\">").append(program.getName()).append("</p>");
            html.append("</div>");
            
            // Content
            html.append("<div style=\"padding:30px;\">");
            
            // Priority Badge
            String priorityColor = "URGENT".equalsIgnoreCase(requisition.getPriority()) ? "#ff6b35" :
                                   "EMERGENCY".equalsIgnoreCase(requisition.getPriority()) ? "#dc2626" : "#10b981";
            html.append("<div style=\"background:").append(priorityColor).append(";color:#ffffff;padding:8px 16px;border-radius:20px;display:inline-block;font-size:12px;font-weight:600;margin-bottom:20px;\">");
            html.append(requisition.getPriority()).append(" PRIORITY");
            html.append("</div>");
            
            // Requisition Details
            html.append("<h2 style=\"color:#1f2937;font-size:20px;margin:0 0 20px 0;padding-bottom:10px;border-bottom:2px solid #e5e7eb;\">Requisition Details</h2>");
            
            html.append("<table style=\"width:100%;border-collapse:collapse;margin-bottom:20px;\">");
            html.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;width:35%;\"><strong>Requisition #:</strong></td>");
            html.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">").append(requisition.getRequisitionNumber()).append("</td></tr>");
            
            html.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Item Name:</strong></td>");
            html.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;font-weight:600;\">").append(requisition.getItemName()).append("</td></tr>");
            
            html.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;\"><strong>Category:</strong></td>");
            html.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">").append(requisition.getCategory()).append("</td></tr>");
            
            html.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Quantity:</strong></td>");
            html.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(requisition.getQuantityRequested()).append(" ").append(requisition.getUnitOfMeasurement()).append("</td></tr>");
            
            if (requisition.getEstimatedCost() != null) {
                html.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;\"><strong>Estimated Cost:</strong></td>");
                html.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">$").append(requisition.getEstimatedCost()).append("</td></tr>");
            }
            
            if (requisition.getPreferredVendor() != null && !requisition.getPreferredVendor().isBlank()) {
                html.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Preferred Vendor:</strong></td>");
                html.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(requisition.getPreferredVendor()).append("</td></tr>");
            }
            
            html.append("<tr><td style=\"padding:10px 0;color:#6b7280;font-size:13px;\"><strong>Requested By:</strong></td>");
            html.append("<td style=\"padding:10px 0;color:#1f2937;font-size:14px;\">").append(requisition.getRequestedByName()).append("</td></tr>");
            
            html.append("<tr style=\"background:#f9fafb;\"><td style=\"padding:10px;color:#6b7280;font-size:13px;\"><strong>Request Date:</strong></td>");
            html.append("<td style=\"padding:10px;color:#1f2937;font-size:14px;\">").append(requisition.getRequestDate()).append("</td></tr>");
            html.append("</table>");
            
            // Justification
            html.append("<h3 style=\"color:#1f2937;font-size:16px;margin:25px 0 10px 0;\">Justification/Purpose:</h3>");
            html.append("<div style=\"background:#f3f4f6;padding:15px;border-radius:6px;color:#374151;font-size:14px;line-height:1.6;\">");
            html.append(requisition.getJustification().replace("\n", "<br/>"));
            html.append("</div>");
            
            // Call to Action
            html.append("<div style=\"margin-top:30px;padding:20px;background:#eff6ff;border-left:4px solid #0046AD;border-radius:4px;\">");
            html.append("<p style=\"margin:0;color:#1e40af;font-size:14px;\"><strong>⚠️ Action Required:</strong> Please review and approve or reject this requisition in the inventory management system.</p>");
            html.append("</div>");
            
            html.append("</div>");
            
            // Footer
            html.append("<div style=\"background:#f9fafb;padding:20px;text-align:center;border-radius:0 0 8px 8px;border-top:1px solid #e5e7eb;\">");
            html.append("<p style=\"margin:0;color:#6b7280;font-size:12px;\">This is an automated notification from the DYS Inventory Management System.</p>");
            html.append("<p style=\"margin:5px 0 0 0;color:#9ca3af;font-size:11px;\">© ").append(java.time.Year.now().getValue()).append(" Ohio Department of Youth Services</p>");
            html.append("</div>");
            
            html.append("</div>");
            html.append("</body></html>");
            
            // Send to all recipients
            for (String email : recipients) {
                mailService.sendRawHtml(email, subject, html.toString());
                System.out.println("[INFO] Sent requisition notification email to: " + email);
            }
            
        } catch (Exception e) {
            System.err.println("[ERROR] Failed to send requisition emails: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
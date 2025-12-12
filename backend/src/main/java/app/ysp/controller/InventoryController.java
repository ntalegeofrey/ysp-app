package app.ysp.controller;

import app.ysp.domain.User;
import app.ysp.dto.*;
import app.ysp.repo.UserRepository;
import app.ysp.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/programs/{programId}/inventory")
public class InventoryController {
    
    private final InventoryService inventoryService;
    private final UserRepository userRepository;
    
    public InventoryController(InventoryService inventoryService, UserRepository userRepository) {
        this.inventoryService = inventoryService;
        this.userRepository = userRepository;
    }
    
    // ========== INVENTORY ITEMS ==========
    
    /**
     * Get all inventory items
     */
    @GetMapping("/items")
    public ResponseEntity<List<InventoryItemResponse>> getAllItems(@PathVariable Long programId) {
        List<InventoryItemResponse> items = inventoryService.getAllItems(programId);
        return ResponseEntity.ok(items);
    }
    
    /**
     * Get items with filtering and pagination
     */
    @GetMapping("/items/filter")
    public ResponseEntity<Map<String, Object>> filterItems(
            @PathVariable Long programId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> result = inventoryService.filterItems(programId, category, status, searchTerm, page, size);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Get single item
     */
    @GetMapping("/items/{itemId}")
    public ResponseEntity<InventoryItemResponse> getItem(
            @PathVariable Long programId,
            @PathVariable Long itemId) {
        InventoryItemResponse item = inventoryService.getItemById(programId, itemId);
        return ResponseEntity.ok(item);
    }
    
    /**
     * Add new inventory item
     */
    @PostMapping("/items")
    public ResponseEntity<InventoryItemResponse> addItem(
            @PathVariable Long programId,
            @RequestBody InventoryItemRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        InventoryItemResponse item = inventoryService.addItem(programId, request, staffId);
        return ResponseEntity.ok(item);
    }
    
    /**
     * Update inventory item
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<InventoryItemResponse> updateItem(
            @PathVariable Long programId,
            @PathVariable Long itemId,
            @RequestBody InventoryItemRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        InventoryItemResponse item = inventoryService.updateItem(programId, itemId, request, staffId);
        return ResponseEntity.ok(item);
    }
    
    // ========== CHECKOUT ==========
    
    /**
     * Checkout items from inventory
     */
    @PostMapping("/checkout")
    public ResponseEntity<InventoryTransactionResponse> checkoutItem(
            @PathVariable Long programId,
            @RequestBody InventoryCheckoutRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        InventoryTransactionResponse transaction = inventoryService.checkoutItem(programId, request, staffId);
        return ResponseEntity.ok(transaction);
    }
    
    // ========== TRANSACTIONS (LOG) ==========
    
    /**
     * Get transaction history with filtering
     */
    @GetMapping("/transactions")
    public ResponseEntity<Map<String, Object>> getTransactions(
            @PathVariable Long programId,
            @RequestParam(required = false) String transactionType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> result = inventoryService.getTransactionHistory(
            programId, transactionType, category, searchTerm, page, size);
        return ResponseEntity.ok(result);
    }
    
    // ========== REQUISITIONS ==========
    
    /**
     * Create new requisition
     */
    @PostMapping("/requisitions")
    public ResponseEntity<InventoryRequisitionResponse> createRequisition(
            @PathVariable Long programId,
            @RequestBody InventoryRequisitionRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        InventoryRequisitionResponse requisition = inventoryService.createRequisition(programId, request, staffId);
        return ResponseEntity.ok(requisition);
    }
    
    /**
     * Get requisitions with filtering
     */
    @GetMapping("/requisitions")
    public ResponseEntity<Map<String, Object>> getRequisitions(
            @PathVariable Long programId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Map<String, Object> result = inventoryService.getRequisitions(
            programId, status, category, priority, searchTerm, page, size);
        return ResponseEntity.ok(result);
    }
    
    /**
     * Review requisition (approve/reject)
     */
    @PatchMapping("/requisitions/{requisitionId}/review")
    public ResponseEntity<InventoryRequisitionResponse> reviewRequisition(
            @PathVariable Long programId,
            @PathVariable Long requisitionId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        String action = body.get("action"); // APPROVE or REJECT
        String notes = body.get("notes");
        
        InventoryRequisitionResponse requisition = inventoryService.reviewRequisition(
            programId, requisitionId, action, notes, staffId);
        return ResponseEntity.ok(requisition);
    }
    
    /**
     * Update requisition status (UNDER_REVIEW, APPROVED, DECLINED)
     * Only accessible by ADMIN or ADMINISTRATOR roles
     */
    @PatchMapping("/requisitions/{requisitionId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InventoryRequisitionResponse> updateRequisitionStatus(
            @PathVariable Long programId,
            @PathVariable Long requisitionId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        String newStatus = body.get("status"); // UNDER_REVIEW, APPROVED, DECLINED
        String remarks = body.get("remarks");
        
        InventoryRequisitionResponse requisition = inventoryService.updateRequisitionStatus(
            programId, requisitionId, newStatus, remarks, staffId);
        return ResponseEntity.ok(requisition);
    }
    
    // ========== STATS & DASHBOARD ==========
    
    /**
     * Get inventory statistics for dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInventoryStats(@PathVariable Long programId) {
        Map<String, Object> stats = inventoryService.getInventoryStats(programId);
        return ResponseEntity.ok(stats);
    }
    
    // ========== AUDITS ==========
    
    /**
     * Get all audits for a program
     */
    @GetMapping("/audits")
    public ResponseEntity<List<Map<String, Object>>> getAudits(@PathVariable Long programId) {
        List<Map<String, Object>> audits = inventoryService.getAudits(programId);
        return ResponseEntity.ok(audits);
    }
    
    /**
     * Get audit details
     */
    @GetMapping("/audits/{auditId}")
    public ResponseEntity<Map<String, Object>> getAuditDetails(
            @PathVariable Long programId,
            @PathVariable Long auditId) {
        Map<String, Object> audit = inventoryService.getAuditDetails(programId, auditId);
        return ResponseEntity.ok(audit);
    }
    
    /**
     * Save audit
     */
    @PostMapping("/audits")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> saveAudit(
            @PathVariable Long programId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        LocalDate auditDate = LocalDate.parse(request.get("date").toString());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
        
        Map<String, Object> result = inventoryService.saveAudit(programId, staffId, auditDate, items);
        return ResponseEntity.ok(result);
    }
    
    // ========== HELPER METHODS ==========
    
    /**
     * Extract staff ID from authentication (matching working pattern from OffsiteMovementController)
     */
    private Long getStaffIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Authentication required");
        }
        
        try {
            // Try to get ID from principal if it's a Map
            if (authentication.getPrincipal() instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> principal = (Map<String, Object>) authentication.getPrincipal();
                Object idObj = principal.get("id");
                if (idObj instanceof Number) {
                    return ((Number) idObj).longValue();
                } else if (idObj instanceof String) {
                    return Long.parseLong((String) idObj);
                }
            }
            
            // If not in principal, authentication.getName() returns email - look up user
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            return user.getId();
        } catch (NumberFormatException e) {
            // If we get a number format exception, try to look up by email
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
            return user.getId();
        } catch (Exception e) {
            throw new RuntimeException("Unable to extract staff ID from authentication", e);
        }
    }
}

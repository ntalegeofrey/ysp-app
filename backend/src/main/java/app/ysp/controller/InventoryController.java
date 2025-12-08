package app.ysp.controller;

import app.ysp.dto.*;
import app.ysp.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/programs/{programId}/inventory")
public class InventoryController {
    
    private final InventoryService inventoryService;
    
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
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
    
    // ========== STATS & DASHBOARD ==========
    
    /**
     * Get inventory statistics for dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getInventoryStats(@PathVariable Long programId) {
        Map<String, Object> stats = inventoryService.getInventoryStats(programId);
        return ResponseEntity.ok(stats);
    }
    
    // ========== HELPER METHODS ==========
    
    /**
     * Extract staff ID from authentication
     * Handles both JWT and session-based authentication
     */
    private Long getStaffIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Authentication required");
        }
        
        try {
            // Try to get ID from principal if it's a Map (JWT)
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
            
            // Fallback: try to parse authentication name as ID
            String name = authentication.getName();
            try {
                return Long.parseLong(name);
            } catch (NumberFormatException e) {
                // If name is not a number (e.g., email), throw error
                throw new RuntimeException("Unable to extract staff ID from authentication. User ID: " + name);
            }
        } catch (Exception e) {
            throw new RuntimeException("Unable to extract staff ID from authentication", e);
        }
    }
}

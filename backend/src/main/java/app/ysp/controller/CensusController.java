package app.ysp.controller;

import app.ysp.domain.User;
import app.ysp.dto.CensusRequest;
import app.ysp.dto.CensusResponse;
import app.ysp.repo.UserRepository;
import app.ysp.service.CensusService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programs/{programId}/census")
public class CensusController {
    private final CensusService censusService;
    private final UserRepository userRepository;

    public CensusController(CensusService censusService, UserRepository userRepository) {
        this.censusService = censusService;
        this.userRepository = userRepository;
    }

    /**
     * Get all censuses for a program
     */
    @GetMapping
    public ResponseEntity<List<CensusResponse>> getCensuses(@PathVariable Long programId) {
        List<CensusResponse> censuses = censusService.getCensuses(programId);
        return ResponseEntity.ok(censuses);
    }

    /**
     * Get census by ID
     */
    @GetMapping("/{censusId}")
    public ResponseEntity<CensusResponse> getCensusById(
            @PathVariable Long programId,
            @PathVariable Long censusId) {
        CensusResponse census = censusService.getCensusById(programId, censusId);
        return ResponseEntity.ok(census);
    }

    /**
     * Save census
     */
    @PostMapping
    public ResponseEntity<CensusResponse> saveCensus(
            @PathVariable Long programId,
            @RequestBody CensusRequest request,
            Authentication authentication) {
        Long staffId = getStaffIdFromAuth(authentication);
        
        try {
            CensusResponse response = censusService.saveCensus(programId, staffId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("already exists")) {
                return ResponseEntity.status(409).body(null); // Conflict
            }
            throw e;
        }
    }

    /**
     * Extract staff ID from authentication
     */
    private Long getStaffIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Authentication required");
        }

        Object principal = authentication.getPrincipal();
        
        // Try to get ID directly from principal if it's a Map
        if (principal instanceof java.util.Map) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> principalMap = (java.util.Map<String, Object>) principal;
            Object idObj = principalMap.get("id");
            if (idObj != null) {
                if (idObj instanceof Number) {
                    return ((Number) idObj).longValue();
                }
                try {
                    return Long.parseLong(idObj.toString());
                } catch (NumberFormatException e) {
                    // Continue to email lookup
                }
            }
        }

        // Fall back to looking up by email
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }
}

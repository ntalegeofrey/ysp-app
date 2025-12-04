package app.ysp.controller;

import app.ysp.dto.StaffMemberResponse;
import app.ysp.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class StaffController {
    
    private final StaffService staffService;
    
    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }
    
    /**
     * Get all staff for a specific program
     * Merges User + ProgramAssignment data with formatted display names
     */
    @GetMapping("/programs/{programId}/staff")
    @PreAuthorize("isAuthenticated()")
    public List<StaffMemberResponse> getProgramStaff(@PathVariable Long programId) {
        return staffService.getProgramStaff(programId);
    }
    
    /**
     * Get staff member by user ID
     */
    @GetMapping("/staff/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StaffMemberResponse> getStaffByUserId(@PathVariable Long userId) {
        Optional<StaffMemberResponse> staff = staffService.getStaffByUserId(userId);
        return staff.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get staff member by employee number (6-digit identifier)
     */
    @GetMapping("/staff/employee/{employeeNumber}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StaffMemberResponse> getStaffByEmployeeNumber(@PathVariable String employeeNumber) {
        Optional<StaffMemberResponse> staff = staffService.getStaffByEmployeeNumber(employeeNumber);
        return staff.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get staff member by email
     */
    @GetMapping("/staff/email/{email}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<StaffMemberResponse> getStaffByEmail(@PathVariable String email) {
        Optional<StaffMemberResponse> staff = staffService.getStaffByEmail(email);
        return staff.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get all staff in a specific region (by region name)
     * Region names: Central, Metro, Northeast, Southeast, Western
     * Note: Also available via /api/regions/{regionId}/staff
     */
    @GetMapping("/regions/{regionName}/staff")
    @PreAuthorize("isAuthenticated()")
    public List<StaffMemberResponse> getRegionStaffByName(@PathVariable String regionName) {
        return staffService.getRegionStaff(regionName);
    }
    
    /**
     * Get all staff in the system
     * Query param: activeOnly=true to filter only enabled users
     */
    @GetMapping("/staff")
    @PreAuthorize("isAuthenticated()")
    public List<StaffMemberResponse> getAllStaff(
            @RequestParam(required = false) Boolean activeOnly) {
        return staffService.getAllStaff(activeOnly);
    }
}

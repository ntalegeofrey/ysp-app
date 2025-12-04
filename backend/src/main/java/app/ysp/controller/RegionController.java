package app.ysp.controller;

import app.ysp.dto.StaffMemberResponse;
import app.ysp.entity.Program;
import app.ysp.entity.Region;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.RegionRepository;
import app.ysp.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/regions")
public class RegionController {

    private final RegionRepository regionRepository;
    private final ProgramRepository programRepository;
    private final StaffService staffService;

    public RegionController(RegionRepository regionRepository, ProgramRepository programRepository, StaffService staffService) {
        this.regionRepository = regionRepository;
        this.programRepository = programRepository;
        this.staffService = staffService;
    }

    /**
     * GET /api/regions
     * List all regions
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATOR')")
    public ResponseEntity<List<Region>> listRegions() {
        return ResponseEntity.ok(regionRepository.findAll());
    }

    /**
     * GET /api/regions/{regionId}
     * Get a specific region by ID
     */
    @GetMapping("/{regionId}")
    @PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATOR')")
    public ResponseEntity<Region> getRegion(@PathVariable Long regionId) {
        Optional<Region> region = regionRepository.findById(regionId);
        return region.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/regions/{regionId}/programs
     * List all programs in this region
     */
    @GetMapping("/{regionId}/programs")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Program>> getRegionPrograms(@PathVariable Long regionId) {
        // Verify region exists
        Optional<Region> regionOpt = regionRepository.findById(regionId);
        if (regionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Get region name to query programs
        String regionName = regionOpt.get().getName();
        List<Long> programIds = programRepository.findProgramIdsByRegion(regionName);
        
        List<Program> programs = programRepository.findAllById(programIds);
        return ResponseEntity.ok(programs);
    }

    /**
     * GET /api/regions/{regionId}/programs/{programId}
     * Get a specific program in this region
     */
    @GetMapping("/{regionId}/programs/{programId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Program> getRegionProgram(
            @PathVariable Long regionId,
            @PathVariable Long programId) {
        
        // Verify region exists
        Optional<Region> regionOpt = regionRepository.findById(regionId);
        if (regionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Get program and verify it belongs to this region
        Optional<Program> programOpt = programRepository.findById(programId);
        if (programOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Program program = programOpt.get();
        String regionName = regionOpt.get().getName();
        
        // Verify program belongs to this region
        if (!regionName.equalsIgnoreCase(program.getRegion())) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(program);
    }

    /**
     * GET /api/regions/{regionId}/staff
     * List all staff in this region (across all programs)
     * Note: This endpoint accepts regionId but internally looks up by region name
     */
    @GetMapping("/{regionId}/staff")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<StaffMemberResponse>> getRegionStaff(@PathVariable Long regionId) {
        // Verify region exists and get its name
        Optional<Region> regionOpt = regionRepository.findById(regionId);
        if (regionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        String regionName = regionOpt.get().getName();
        List<StaffMemberResponse> staff = staffService.getRegionStaff(regionName);
        return ResponseEntity.ok(staff);
    }
}

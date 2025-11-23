package app.ysp.controller;

import app.ysp.entity.Region;
import app.ysp.repo.RegionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/regions")
@PreAuthorize("hasAnyRole('ADMIN','ADMINISTRATOR')")
public class RegionController {

    private final RegionRepository regions;

    public RegionController(RegionRepository regions) {
        this.regions = regions;
    }

    @GetMapping
    public ResponseEntity<List<Region>> listRegions() {
        return ResponseEntity.ok(regions.findAll());
    }
}

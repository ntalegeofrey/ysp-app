package app.ysp.controller;

import app.ysp.entity.FirePlan;
import app.ysp.entity.Program;
import app.ysp.repo.FirePlanRepository;
import app.ysp.repo.ProgramRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
public class FloorPlanController {

    private final FirePlanRepository firePlans;
    private final ProgramRepository programs;
    
    // Directory to store floor plan images
    private static final String UPLOAD_DIR = "/opt/ysp-app/uploads/floor-plans/";

    public FloorPlanController(FirePlanRepository firePlans, ProgramRepository programs) {
        this.firePlans = firePlans;
        this.programs = programs;
        
        // Create upload directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            System.err.println("Failed to create floor plans upload directory: " + e.getMessage());
        }
    }

    @PostMapping("/floor-plans/upload")
    public ResponseEntity<?> uploadFloorPlan(
            @RequestParam("file") MultipartFile file,
            @RequestParam("programId") Long programId) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
        }

        // Validate file size (10MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size must be less than 10MB"));
        }

        try {
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : ".png";
            String filename = "floor-plan-" + programId + "-" + UUID.randomUUID() + extension;
            
            // Save file
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL path
            String imageUrl = "/uploads/floor-plans/" + filename;

            return ResponseEntity.ok(Map.of("imageUrl", imageUrl, "filename", filename));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload file: " + e.getMessage()));
        }
    }

    @GetMapping("/programs/{id}/fire-plan/floor-plan")
    public ResponseEntity<?> getFloorPlanDetails(@PathVariable("id") Long programId) {
        Optional<FirePlan> planOpt = firePlans.findActivePlan(programId);
        if (planOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "imageUrl", "",
                "scale", "1:100",
                "totalExits", 6,
                "assemblyPoints", 3,
                "primaryRouteColor", "#dc2626",
                "secondaryRouteColor", "#f59e0b",
                "assemblyPointColor", "#16a34a"
            ));
        }

        FirePlan plan = planOpt.get();
        return ResponseEntity.ok(Map.of(
            "imageUrl", plan.getFloorPlanImageUrl() != null ? plan.getFloorPlanImageUrl() : "",
            "scale", plan.getFloorPlanScale() != null ? plan.getFloorPlanScale() : "1:100",
            "totalExits", plan.getFloorPlanTotalExits() != null ? plan.getFloorPlanTotalExits() : 6,
            "assemblyPoints", plan.getFloorPlanAssemblyPoints() != null ? plan.getFloorPlanAssemblyPoints() : 3,
            "primaryRouteColor", plan.getFloorPlanPrimaryRouteColor() != null ? plan.getFloorPlanPrimaryRouteColor() : "#dc2626",
            "secondaryRouteColor", plan.getFloorPlanSecondaryRouteColor() != null ? plan.getFloorPlanSecondaryRouteColor() : "#f59e0b",
            "assemblyPointColor", plan.getFloorPlanAssemblyPointColor() != null ? plan.getFloorPlanAssemblyPointColor() : "#16a34a"
        ));
    }

    @PatchMapping("/programs/{id}/fire-plan/floor-plan")
    public ResponseEntity<?> updateFloorPlanDetails(
            @PathVariable("id") Long programId,
            @RequestBody Map<String, Object> body) {
        
        Optional<Program> progOpt = programs.findById(programId);
        if (progOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Get or create fire plan
        Optional<FirePlan> planOpt = firePlans.findActivePlan(programId);
        FirePlan plan;
        if (planOpt.isEmpty()) {
            plan = new FirePlan();
            plan.setProgram(progOpt.get());
            plan.setGeneratedDate(LocalDate.now());
            plan.setStatus("Active");
        } else {
            plan = planOpt.get();
        }

        // Update floor plan details
        if (body.containsKey("imageUrl")) {
            plan.setFloorPlanImageUrl(String.valueOf(body.get("imageUrl")));
        }
        if (body.containsKey("scale")) {
            plan.setFloorPlanScale(String.valueOf(body.get("scale")));
        }
        if (body.containsKey("totalExits")) {
            try {
                plan.setFloorPlanTotalExits(Integer.parseInt(String.valueOf(body.get("totalExits"))));
            } catch (NumberFormatException ignored) {}
        }
        if (body.containsKey("assemblyPoints")) {
            try {
                plan.setFloorPlanAssemblyPoints(Integer.parseInt(String.valueOf(body.get("assemblyPoints"))));
            } catch (NumberFormatException ignored) {}
        }
        if (body.containsKey("primaryRouteColor")) {
            plan.setFloorPlanPrimaryRouteColor(String.valueOf(body.get("primaryRouteColor")));
        }
        if (body.containsKey("secondaryRouteColor")) {
            plan.setFloorPlanSecondaryRouteColor(String.valueOf(body.get("secondaryRouteColor")));
        }
        if (body.containsKey("assemblyPointColor")) {
            plan.setFloorPlanAssemblyPointColor(String.valueOf(body.get("assemblyPointColor")));
        }

        FirePlan saved = firePlans.save(plan);
        return ResponseEntity.ok(saved);
    }
}

package app.ysp.controller;

import app.ysp.entity.IncidentReport;
import app.ysp.entity.ShakedownReport;
import app.ysp.entity.Program;
import app.ysp.repo.IncidentReportRepository;
import app.ysp.repo.ShakedownReportRepository;
import app.ysp.repo.ProgramRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/programs/{programId}/incidents")
public class IncidentController {

    private final IncidentReportRepository incidentReports;
    private final ShakedownReportRepository shakedownReports;
    private final ProgramRepository programs;

    public IncidentController(IncidentReportRepository incidentReports,
                            ShakedownReportRepository shakedownReports,
                            ProgramRepository programs) {
        this.incidentReports = incidentReports;
        this.shakedownReports = shakedownReports;
        this.programs = programs;
    }

    // ============ INCIDENT REPORTS ============

    @GetMapping("/incident-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getIncidentReports(@PathVariable("programId") Long programId) {
        List<IncidentReport> reports = incidentReports.findByProgramIdOrderByDateDesc(programId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/incident-reports/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getIncidentReport(@PathVariable("programId") Long programId, @PathVariable("id") Long id) {
        Optional<IncidentReport> report = incidentReports.findById(id);
        if (report.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report.get());
    }

    @PostMapping("/incident-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> createIncidentReport(@PathVariable("programId") Long programId, @RequestBody Map<String, Object> body) {
        Optional<Program> programOpt = programs.findById(programId);
        if (programOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        IncidentReport report = new IncidentReport();
        report.setProgram(programOpt.get());

        // Basic Information
        if (body.containsKey("incidentDate")) {
            try {
                report.setIncidentDate(LocalDate.parse(Objects.toString(body.get("incidentDate"))));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid incident date format"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Incident date is required"));
        }

        if (body.containsKey("incidentTime")) {
            try {
                report.setIncidentTime(LocalTime.parse(Objects.toString(body.get("incidentTime"))));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid incident time format"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Incident time is required"));
        }

        report.setShift(Objects.toString(body.get("shift"), null));
        report.setAreaOfIncident(Objects.toString(body.get("areaOfIncident"), null));

        if (body.containsKey("natureOfIncident")) {
            report.setNatureOfIncident(Objects.toString(body.get("natureOfIncident")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Nature of incident is required"));
        }

        // People Involved
        report.setResidentsInvolved(Objects.toString(body.get("residentsInvolved"), null));
        report.setStaffInvolved(Objects.toString(body.get("staffInvolved"), null));
        report.setResidentWitnesses(Objects.toString(body.get("residentWitnesses"), null));
        report.setPrimaryStaffRestraint(Objects.toString(body.get("primaryStaffRestraint"), null));

        // Timing Information
        if (body.containsKey("mechanicalsStartTime") && body.get("mechanicalsStartTime") != null) {
            try {
                report.setMechanicalsStartTime(LocalTime.parse(Objects.toString(body.get("mechanicalsStartTime"))));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("mechanicalsFinishTime") && body.get("mechanicalsFinishTime") != null) {
            try {
                report.setMechanicalsFinishTime(LocalTime.parse(Objects.toString(body.get("mechanicalsFinishTime"))));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("roomConfinementStartTime") && body.get("roomConfinementStartTime") != null) {
            try {
                report.setRoomConfinementStartTime(LocalTime.parse(Objects.toString(body.get("roomConfinementStartTime"))));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("roomConfinementFinishTime") && body.get("roomConfinementFinishTime") != null) {
            try {
                report.setRoomConfinementFinishTime(LocalTime.parse(Objects.toString(body.get("roomConfinementFinishTime"))));
            } catch (Exception ignored) {}
        }

        // Population Counts
        if (body.containsKey("staffPopulation")) {
            try {
                report.setStaffPopulation(Integer.parseInt(Objects.toString(body.get("staffPopulation"))));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("youthPopulation")) {
            try {
                report.setYouthPopulation(Integer.parseInt(Objects.toString(body.get("youthPopulation"))));
            } catch (Exception ignored) {}
        }

        // Description
        if (body.containsKey("detailedDescription")) {
            report.setDetailedDescription(Objects.toString(body.get("detailedDescription")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Detailed description is required"));
        }

        // Certification & Signature
        if (body.containsKey("reportCompletedBy")) {
            report.setReportCompletedBy(Objects.toString(body.get("reportCompletedBy")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Report completed by is required"));
        }
        
        report.setReportCompletedByEmail(Objects.toString(body.get("reportCompletedByEmail"), null));

        if (body.containsKey("signatureDatetime")) {
            try {
                report.setSignatureDatetime(LocalDateTime.parse(Objects.toString(body.get("signatureDatetime"))));
            } catch (Exception e) {
                report.setSignatureDatetime(LocalDateTime.now());
            }
        } else {
            report.setSignatureDatetime(LocalDateTime.now());
        }

        if (body.containsKey("certificationComplete")) {
            report.setCertificationComplete(Boolean.parseBoolean(Objects.toString(body.get("certificationComplete"))));
        }

        // Status and priority
        report.setStatus(Objects.toString(body.get("status"), "Submitted"));
        
        // createdBy from authentication context would go here
        if (body.containsKey("createdBy")) {
            try {
                report.setCreatedBy(Long.parseLong(Objects.toString(body.get("createdBy"))));
            } catch (Exception ignored) {}
        }

        IncidentReport saved = incidentReports.save(report);
        return ResponseEntity.ok(saved);
    }

    // ============ SHAKEDOWN REPORTS ============

    @GetMapping("/shakedown-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getShakedownReports(@PathVariable("programId") Long programId) {
        List<ShakedownReport> reports = shakedownReports.findByProgramIdOrderByDateDesc(programId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/shakedown-reports/{id}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> getShakedownReport(@PathVariable("programId") Long programId, @PathVariable("id") Long id) {
        Optional<ShakedownReport> report = shakedownReports.findById(id);
        if (report.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report.get());
    }

    @PostMapping("/shakedown-reports")
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> createShakedownReport(@PathVariable("programId") Long programId, @RequestBody Map<String, Object> body) {
        Optional<Program> programOpt = programs.findById(programId);
        if (programOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ShakedownReport report = new ShakedownReport();
        report.setProgram(programOpt.get());

        // Basic Information
        if (body.containsKey("shakedownDate")) {
            try {
                report.setShakedownDate(LocalDate.parse(Objects.toString(body.get("shakedownDate"))));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid shakedown date format"));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Shakedown date is required"));
        }

        report.setShift(Objects.toString(body.get("shift"), null));

        // Search Results (JSON stored as TEXT)
        report.setCommonAreaSearches(Objects.toString(body.get("commonAreaSearches"), null));
        report.setSchoolAreaSearches(Objects.toString(body.get("schoolAreaSearches"), null));
        report.setResidentRoomSearches(Objects.toString(body.get("residentRoomSearches"), null));
        report.setEquipmentCondition(Objects.toString(body.get("equipmentCondition"), null));

        // Opposite Gender Announcements
        if (body.containsKey("announcementTime") && body.get("announcementTime") != null) {
            try {
                report.setAnnouncementTime(LocalTime.parse(Objects.toString(body.get("announcementTime"))));
            } catch (Exception ignored) {}
        }
        report.setAnnouncementStaff(Objects.toString(body.get("announcementStaff"), null));
        report.setAnnouncementAreas(Objects.toString(body.get("announcementAreas"), null));

        // Additional Comments
        report.setAdditionalComments(Objects.toString(body.get("additionalComments"), null));

        // Certification & Signature
        if (body.containsKey("reportCompletedBy")) {
            report.setReportCompletedBy(Objects.toString(body.get("reportCompletedBy")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Report completed by is required"));
        }
        
        report.setReportCompletedByEmail(Objects.toString(body.get("reportCompletedByEmail"), null));

        if (body.containsKey("signatureDatetime")) {
            try {
                report.setSignatureDatetime(LocalDateTime.parse(Objects.toString(body.get("signatureDatetime"))));
            } catch (Exception e) {
                report.setSignatureDatetime(LocalDateTime.now());
            }
        } else {
            report.setSignatureDatetime(LocalDateTime.now());
        }

        if (body.containsKey("certificationComplete")) {
            report.setCertificationComplete(Boolean.parseBoolean(Objects.toString(body.get("certificationComplete"))));
        }

        // Status
        report.setStatus(Objects.toString(body.get("status"), "Submitted"));
        
        if (body.containsKey("contrabandFound")) {
            report.setContrabandFound(Boolean.parseBoolean(Objects.toString(body.get("contrabandFound"))));
        }

        // createdBy from authentication context would go here
        if (body.containsKey("createdBy")) {
            try {
                report.setCreatedBy(Long.parseLong(Objects.toString(body.get("createdBy"))));
            } catch (Exception ignored) {}
        }

        ShakedownReport saved = shakedownReports.save(report);
        return ResponseEntity.ok(saved);
    }
}

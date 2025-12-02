package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.*;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.entity.WatchAssignment;
import app.ysp.entity.WatchLogEntry;
import app.ysp.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WatchService {

    private final WatchAssignmentRepository watchAssignmentRepository;
    private final WatchLogEntryRepository watchLogEntryRepository;
    private final ProgramRepository programRepository;
    private final ProgramResidentRepository residentRepository;
    private final UserRepository userRepository;

    public WatchService(WatchAssignmentRepository watchAssignmentRepository,
                       WatchLogEntryRepository watchLogEntryRepository,
                       ProgramRepository programRepository,
                       ProgramResidentRepository residentRepository,
                       UserRepository userRepository) {
        this.watchAssignmentRepository = watchAssignmentRepository;
        this.watchLogEntryRepository = watchLogEntryRepository;
        this.programRepository = programRepository;
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
    }

    // ============ WATCH ASSIGNMENTS ============

    /**
     * Get all active watches for a program
     */
    public List<WatchAssignmentResponse> getActiveWatches(Long programId) {
        List<WatchAssignment> watches = watchAssignmentRepository.findActiveWatchesByProgramId(programId);
        return watches.stream()
                .map(this::mapToWatchResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all watches (including archived) for a program
     */
    public List<WatchAssignmentResponse> getAllWatches(Long programId) {
        List<WatchAssignment> watches = watchAssignmentRepository.findByProgramIdOrderByStartDateDesc(programId);
        return watches.stream()
                .map(this::mapToWatchResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get archived watches for a program
     */
    public List<WatchAssignmentResponse> getArchivedWatches(Long programId) {
        List<WatchAssignment> watches = watchAssignmentRepository.findByProgramIdOrderByStartDateDesc(programId);
        return watches.stream()
                .filter(w -> !"ACTIVE".equals(w.getStatus()))
                .map(this::mapToWatchResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get watch by ID
     */
    public Optional<WatchAssignmentResponse> getWatchById(Long id) {
        return watchAssignmentRepository.findById(id)
                .map(this::mapToWatchResponse);
    }

    /**
     * Get current active watch for a resident
     */
    public Optional<WatchAssignmentResponse> getCurrentWatchForResident(Long residentId) {
        return watchAssignmentRepository.findActiveWatchByResidentId(residentId)
                .map(this::mapToWatchResponse);
    }

    /**
     * Get watch history for a resident
     */
    public List<WatchAssignmentResponse> getResidentWatchHistory(Long residentId) {
        List<WatchAssignment> watches = watchAssignmentRepository.findByResidentIdOrderByStartDateDesc(residentId);
        return watches.stream()
                .map(this::mapToWatchResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get statistics for a program
     */
    public Map<String, Object> getWatchStatistics(Long programId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalActive = watchAssignmentRepository.countActiveWatchesByProgramId(programId);
        long elevatedCount = watchAssignmentRepository.countActiveWatchesByProgramIdAndWatchType(programId, "ELEVATED");
        long alertCount = watchAssignmentRepository.countActiveWatchesByProgramIdAndWatchType(programId, "ALERT");
        long generalCount = watchAssignmentRepository.countActiveWatchesByProgramIdAndWatchType(programId, "GENERAL");
        
        stats.put("totalActive", totalActive);
        stats.put("elevated", elevatedCount);
        stats.put("alert", alertCount);
        stats.put("general", generalCount);
        
        return stats;
    }

    /**
     * Create a new watch assignment (clinician only)
     */
    @Transactional
    public WatchAssignmentResponse createWatch(Long programId, WatchAssignmentRequest request, String clinicianEmail) {
        // Validate request
        validateWatchRequest(request);

        // Get program
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found with id: " + programId));

        // Get resident
        ProgramResident resident = residentRepository.findById(request.getResidentId())
                .orElseThrow(() -> new IllegalArgumentException("Resident not found with id: " + request.getResidentId()));

        // Verify resident belongs to program
        if (!resident.getProgram().getId().equals(programId)) {
            throw new IllegalArgumentException("Resident does not belong to this program");
        }

        // Check if resident already has an active watch
        Optional<WatchAssignment> existingWatch = watchAssignmentRepository.findActiveWatchByResidentId(request.getResidentId());
        if (existingWatch.isPresent()) {
            throw new IllegalArgumentException("Resident already has an active watch. Please end the current watch first.");
        }

        // Get clinician
        User clinician = userRepository.findByEmailIgnoreCase(clinicianEmail)
                .orElseThrow(() -> new IllegalArgumentException("Clinician not found"));

        // Create watch assignment
        WatchAssignment watch = new WatchAssignment();
        watch.setResident(resident);
        watch.setProgram(program);
        watch.setWatchType(request.getWatchType());
        watch.setStartDateTime(request.getStartDateTime() != null ? request.getStartDateTime() : Instant.now());
        watch.setClinicalReason(request.getClinicalReason());
        
        // Set risk flags (default to false if not provided)
        watch.setSelfHarmRisk(request.getSelfHarmRisk() != null ? request.getSelfHarmRisk() : false);
        watch.setSuicidalIdeation(request.getSuicidalIdeation() != null ? request.getSuicidalIdeation() : false);
        watch.setAggressiveBehavior(request.getAggressiveBehavior() != null ? request.getAggressiveBehavior() : false);
        watch.setSleepDisturbance(request.getSleepDisturbance() != null ? request.getSleepDisturbance() : false);
        watch.setMedicalConcern(request.getMedicalConcern() != null ? request.getMedicalConcern() : false);
        
        watch.setAuthorizedByClinician(clinician);
        watch.setStatus("ACTIVE");

        WatchAssignment saved = watchAssignmentRepository.save(watch);
        return mapToWatchResponse(saved);
    }

    /**
     * End a watch assignment
     */
    @Transactional
    public WatchAssignmentResponse endWatch(Long watchId, EndWatchRequest request, String staffEmail) {
        WatchAssignment watch = watchAssignmentRepository.findById(watchId)
                .orElseThrow(() -> new IllegalArgumentException("Watch not found with id: " + watchId));

        if (!"ACTIVE".equals(watch.getStatus())) {
            throw new IllegalArgumentException("Watch is not active");
        }

        User staff = userRepository.findByEmailIgnoreCase(staffEmail)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        watch.setEndDateTime(request.getEndDateTime() != null ? request.getEndDateTime() : Instant.now());
        watch.setStatus(request.getStatus() != null ? request.getStatus() : "COMPLETED");
        watch.setOutcome(request.getOutcome());
        watch.setEndNotes(request.getEndNotes());
        watch.setEndedByStaff(staff);

        WatchAssignment saved = watchAssignmentRepository.save(watch);
        return mapToWatchResponse(saved);
    }

    // ============ WATCH LOG ENTRIES ============

    /**
     * Get all log entries for a watch
     */
    public List<WatchLogEntryResponse> getLogEntries(Long watchId) {
        List<WatchLogEntry> entries = watchLogEntryRepository.findByWatchAssignmentIdOrderByTimeDesc(watchId);
        return entries.stream()
                .map(this::mapToLogEntryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get recent log entries (last 6 hours)
     */
    public List<WatchLogEntryResponse> getRecentLogEntries(Long watchId) {
        Instant sixHoursAgo = Instant.now().minus(Duration.ofHours(6));
        List<WatchLogEntry> entries = watchLogEntryRepository.findRecentEntriesByWatchAssignmentId(watchId, sixHoursAgo);
        return entries.stream()
                .map(this::mapToLogEntryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Create a log entry for a watch
     */
    @Transactional
    public WatchLogEntryResponse createLogEntry(Long watchId, WatchLogEntryRequest request, String staffEmail) {
        // Validate request
        validateLogEntryRequest(request);

        // Get watch
        WatchAssignment watch = watchAssignmentRepository.findById(watchId)
                .orElseThrow(() -> new IllegalArgumentException("Watch not found with id: " + watchId));

        if (!"ACTIVE".equals(watch.getStatus())) {
            throw new IllegalArgumentException("Cannot add log entry to an inactive watch");
        }

        // Get staff
        User staff = userRepository.findByEmailIgnoreCase(staffEmail)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        // Create log entry
        WatchLogEntry entry = new WatchLogEntry();
        entry.setWatchAssignment(watch);
        entry.setObservationTime(request.getObservationTime() != null ? request.getObservationTime() : Instant.now());
        entry.setObservationStatus(request.getObservationStatus());
        entry.setActivity(request.getActivity());
        entry.setNotes(request.getNotes());
        entry.setLoggedByStaff(staff);

        WatchLogEntry saved = watchLogEntryRepository.save(entry);
        return mapToLogEntryResponse(saved);
    }

    // ============ VALIDATION ============

    private void validateWatchRequest(WatchAssignmentRequest request) {
        if (request.getResidentId() == null) {
            throw new IllegalArgumentException("Resident ID is required");
        }
        if (request.getWatchType() == null || request.getWatchType().isBlank()) {
            throw new IllegalArgumentException("Watch type is required");
        }
        if (!List.of("ELEVATED", "ALERT", "GENERAL").contains(request.getWatchType())) {
            throw new IllegalArgumentException("Invalid watch type. Must be ELEVATED, ALERT, or GENERAL");
        }
        if (request.getClinicalReason() == null || request.getClinicalReason().isBlank()) {
            throw new IllegalArgumentException("Clinical reason is required");
        }
    }

    private void validateLogEntryRequest(WatchLogEntryRequest request) {
        if (request.getObservationStatus() == null || request.getObservationStatus().isBlank()) {
            throw new IllegalArgumentException("Observation status is required");
        }
        if (!List.of("NORMAL", "HIGH", "CRITICAL").contains(request.getObservationStatus())) {
            throw new IllegalArgumentException("Invalid observation status. Must be NORMAL, HIGH, or CRITICAL");
        }
        if (request.getActivity() == null || request.getActivity().isBlank()) {
            throw new IllegalArgumentException("Activity is required");
        }
        if (!List.of("SLEEPING", "LAYING_ON_BED", "WALKING", "PLAYING", "ENGAGING", "BATHROOM", "OTHER").contains(request.getActivity())) {
            throw new IllegalArgumentException("Invalid activity");
        }
        if (request.getNotes() == null || request.getNotes().isBlank()) {
            throw new IllegalArgumentException("Notes are required");
        }
    }

    // ============ MAPPING ============

    private WatchAssignmentResponse mapToWatchResponse(WatchAssignment watch) {
        WatchAssignmentResponse response = new WatchAssignmentResponse();
        response.setId(watch.getId());
        response.setResidentId(watch.getResident().getId());
        response.setResidentName(watch.getResident().getFirstName() + " " + watch.getResident().getLastName());
        response.setResidentNumber(watch.getResident().getResidentId());
        response.setRoom(watch.getResident().getRoom());
        response.setProgramId(watch.getProgram().getId());
        response.setWatchType(watch.getWatchType());
        response.setStartDateTime(watch.getStartDateTime());
        response.setEndDateTime(watch.getEndDateTime());
        response.setClinicalReason(watch.getClinicalReason());
        response.setSelfHarmRisk(watch.getSelfHarmRisk());
        response.setSuicidalIdeation(watch.getSuicidalIdeation());
        response.setAggressiveBehavior(watch.getAggressiveBehavior());
        response.setSleepDisturbance(watch.getSleepDisturbance());
        response.setMedicalConcern(watch.getMedicalConcern());
        response.setAuthorizedByClinicianId(watch.getAuthorizedByClinician().getId());
        response.setAuthorizedByClinicianName(getFullName(watch.getAuthorizedByClinician()));
        response.setStatus(watch.getStatus());
        response.setOutcome(watch.getOutcome());
        response.setEndNotes(watch.getEndNotes());
        
        if (watch.getEndedByStaff() != null) {
            response.setEndedByStaffId(watch.getEndedByStaff().getId());
            response.setEndedByStaffName(getFullName(watch.getEndedByStaff()));
        }
        
        response.setCreatedAt(watch.getCreatedAt());
        response.setUpdatedAt(watch.getUpdatedAt());
        
        // Compute total log entries
        long entryCount = watchLogEntryRepository.countByWatchAssignmentId(watch.getId());
        response.setTotalLogEntries(entryCount);
        
        // Compute duration
        if (watch.getEndDateTime() != null) {
            response.setDuration(calculateDuration(watch.getStartDateTime(), watch.getEndDateTime()));
        }
        
        return response;
    }

    private WatchLogEntryResponse mapToLogEntryResponse(WatchLogEntry entry) {
        WatchLogEntryResponse response = new WatchLogEntryResponse();
        response.setId(entry.getId());
        response.setWatchAssignmentId(entry.getWatchAssignment().getId());
        response.setObservationTime(entry.getObservationTime());
        response.setObservationStatus(entry.getObservationStatus());
        response.setActivity(entry.getActivity());
        response.setNotes(entry.getNotes());
        response.setLoggedByStaffId(entry.getLoggedByStaff().getId());
        response.setLoggedByStaffName(getFullName(entry.getLoggedByStaff()));
        response.setCreatedAt(entry.getCreatedAt());
        return response;
    }

    private String getFullName(User user) {
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String lastName = user.getLastName() != null ? user.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? user.getEmail() : fullName;
    }

    private String calculateDuration(Instant start, Instant end) {
        Duration duration = Duration.between(start, end);
        long hours = duration.toHours();
        long minutes = duration.toMinutes() % 60;
        return String.format("%dh %02dm", hours, minutes);
    }
}

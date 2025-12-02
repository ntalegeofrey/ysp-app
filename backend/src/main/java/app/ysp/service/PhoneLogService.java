package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.entity.PhoneLog;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repository.PhoneLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PhoneLogService {

    private final PhoneLogRepository phoneLogRepository;
    private final ProgramRepository programRepository;
    private final ProgramResidentRepository residentRepository;
    private final UserRepository userRepository;

    public PhoneLogService(PhoneLogRepository phoneLogRepository,
                          ProgramRepository programRepository,
                          ProgramResidentRepository residentRepository,
                          UserRepository userRepository) {
        this.phoneLogRepository = phoneLogRepository;
        this.programRepository = programRepository;
        this.residentRepository = residentRepository;
        this.userRepository = userRepository;
    }

    // ============ PHONE LOG QUERIES ============

    /**
     * Get today's phone logs for a program
     */
    public List<Map<String, Object>> getTodaysPhoneLogs(Long programId) {
        LocalDate today = LocalDate.now();
        List<PhoneLog> logs = phoneLogRepository.findTodaysPhoneLogs(programId, today);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get recent phone logs (last N days)
     */
    public List<Map<String, Object>> getRecentPhoneLogs(Long programId, int days) {
        Instant startTime = Instant.now().minus(days, ChronoUnit.DAYS);
        List<PhoneLog> logs = phoneLogRepository.findRecentPhoneLogs(programId, startTime);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get all phone logs for a program with pagination
     */
    public Map<String, Object> getAllPhoneLogs(Long programId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PhoneLog> logPage = phoneLogRepository.findByProgram_IdOrderByCallDateTimeDesc(programId, pageable);
        
        List<Map<String, Object>> logs = logPage.getContent().stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("phoneLogs", logs);
        response.put("totalPages", logPage.getTotalPages());
        response.put("totalElements", logPage.getTotalElements());
        response.put("currentPage", page);
        
        return response;
    }

    /**
     * Get phone log by ID
     */
    public Optional<Map<String, Object>> getPhoneLogById(Long id) {
        return phoneLogRepository.findById(id)
                .map(this::mapToPhoneLogResponse);
    }

    /**
     * Get phone logs for a resident
     */
    public List<Map<String, Object>> getResidentPhoneLogs(Long residentId) {
        List<PhoneLog> logs = phoneLogRepository.findByResident_IdOrderByCallDateTimeDesc(residentId);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get phone logs by call type
     */
    public List<Map<String, Object>> getPhoneLogsByType(Long programId, String callType) {
        List<PhoneLog> logs = phoneLogRepository.findByProgram_IdAndCallTypeOrderByCallDateTimeDesc(programId, callType);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get phone logs with concerning behavior
     */
    public List<Map<String, Object>> getLogsWithConcerningBehavior(Long programId) {
        List<PhoneLog> logs = phoneLogRepository.findLogsWithConcerningBehavior(programId);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get terminated calls
     */
    public List<Map<String, Object>> getTerminatedCalls(Long programId) {
        List<PhoneLog> logs = phoneLogRepository.findTerminatedCalls(programId);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get emergency calls
     */
    public List<Map<String, Object>> getEmergencyCalls(Long programId) {
        List<PhoneLog> logs = phoneLogRepository.findEmergencyCalls(programId);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Search phone logs
     */
    public List<Map<String, Object>> searchPhoneLogs(Long programId, String search) {
        List<PhoneLog> logs = phoneLogRepository.searchPhoneLogs(programId, search);
        return logs.stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
    }

    /**
     * Filter phone logs with complex criteria
     */
    public Map<String, Object> filterPhoneLogs(Long programId, Long residentId, String callType,
                                                String contactRelationship, Instant startTime,
                                                Instant endTime, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PhoneLog> logPage = phoneLogRepository.filterPhoneLogs(
                programId, residentId, callType, contactRelationship, startTime, endTime, pageable);
        
        List<Map<String, Object>> logs = logPage.getContent().stream()
                .map(this::mapToPhoneLogResponse)
                .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("phoneLogs", logs);
        response.put("totalPages", logPage.getTotalPages());
        response.put("totalElements", logPage.getTotalElements());
        response.put("currentPage", page);
        
        return response;
    }

    /**
     * Get statistics for a program
     */
    public Map<String, Object> getPhoneLogStatistics(Long programId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        Instant last30Days = Instant.now().minus(30, ChronoUnit.DAYS);
        
        long todaysCount = phoneLogRepository.countTodaysPhoneLogs(programId, today);
        long totalCount = phoneLogRepository.countByProgram_Id(programId);
        long outgoingCount = phoneLogRepository.countByProgram_IdAndCallType(programId, "OUTGOING");
        long incomingCount = phoneLogRepository.countByProgram_IdAndCallType(programId, "INCOMING");
        long emergencyCount = phoneLogRepository.countByProgram_IdAndCallType(programId, "EMERGENCY");
        long concerningBehaviors = phoneLogRepository.countRecentConcerningBehaviors(programId, last30Days);
        
        stats.put("todaysCalls", todaysCount);
        stats.put("totalCalls", totalCount);
        stats.put("outgoingCalls", outgoingCount);
        stats.put("incomingCalls", incomingCount);
        stats.put("emergencyCalls", emergencyCount);
        stats.put("recentConcerningBehaviors", concerningBehaviors);
        
        return stats;
    }

    // ============ PHONE LOG MUTATIONS ============

    /**
     * Create a new phone log entry
     */
    @Transactional
    public Map<String, Object> createPhoneLog(Long programId, Map<String, Object> request, String staffEmail) {
        // Validate request
        validatePhoneLogRequest(request);

        // Get program
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found with id: " + programId));

        // Get resident
        Long residentId = getLong(request, "residentId");
        ProgramResident resident = residentRepository.findById(residentId)
                .orElseThrow(() -> new IllegalArgumentException("Resident not found with id: " + residentId));

        // Verify resident belongs to program
        if (!resident.getProgram().getId().equals(programId)) {
            throw new IllegalArgumentException("Resident does not belong to this program");
        }

        // Get logged by staff
        User loggedByStaff = userRepository.findByEmailIgnoreCase(staffEmail)
                .orElseThrow(() -> new IllegalArgumentException("Staff not found"));

        // Get authorizing staff
        Long authorizingStaffId = getLong(request, "authorizingStaffId");
        User authorizingStaff = userRepository.findById(authorizingStaffId)
                .orElseThrow(() -> new IllegalArgumentException("Authorizing staff not found"));

        // Get monitoring staff
        Long monitoringStaffId = getLong(request, "monitoringStaffId");
        User monitoringStaff = userRepository.findById(monitoringStaffId)
                .orElseThrow(() -> new IllegalArgumentException("Monitoring staff not found"));

        // Create phone log
        PhoneLog phoneLog = new PhoneLog();
        phoneLog.setProgram(program);
        phoneLog.setResident(resident);
        phoneLog.setCallType(getString(request, "callType"));
        phoneLog.setContactRelationship(getString(request, "contactRelationship"));
        phoneLog.setContactName(getString(request, "contactName"));
        phoneLog.setOtherRelationshipDetails(getString(request, "otherRelationshipDetails"));
        phoneLog.setPhoneNumber(getString(request, "phoneNumber"));
        phoneLog.setCallDateTime(getInstant(request, "callDateTime", Instant.now()));
        phoneLog.setDurationMinutes(getInteger(request, "durationMinutes"));
        phoneLog.setAuthorizingStaff(authorizingStaff);
        phoneLog.setMonitoringStaff(monitoringStaff);
        phoneLog.setBehaviorDuringCall(getString(request, "behaviorDuringCall"));
        phoneLog.setPostCallBehavior(getString(request, "postCallBehavior"));
        phoneLog.setAdditionalComments(getString(request, "additionalComments"));
        phoneLog.setCallTerminatedEarly(getBoolean(request, "callTerminatedEarly", false));
        phoneLog.setTerminationReason(getString(request, "terminationReason"));
        phoneLog.setLoggedByStaff(loggedByStaff);

        PhoneLog saved = phoneLogRepository.save(phoneLog);
        return mapToPhoneLogResponse(saved);
    }

    /**
     * Update phone log
     */
    @Transactional
    public Map<String, Object> updatePhoneLog(Long phoneLogId, Map<String, Object> request) {
        PhoneLog phoneLog = phoneLogRepository.findById(phoneLogId)
                .orElseThrow(() -> new IllegalArgumentException("Phone log not found with id: " + phoneLogId));

        // Update fields if provided
        if (request.containsKey("contactName")) {
            phoneLog.setContactName(getString(request, "contactName"));
        }
        if (request.containsKey("phoneNumber")) {
            phoneLog.setPhoneNumber(getString(request, "phoneNumber"));
        }
        if (request.containsKey("durationMinutes")) {
            phoneLog.setDurationMinutes(getInteger(request, "durationMinutes"));
        }
        if (request.containsKey("behaviorDuringCall")) {
            phoneLog.setBehaviorDuringCall(getString(request, "behaviorDuringCall"));
        }
        if (request.containsKey("postCallBehavior")) {
            phoneLog.setPostCallBehavior(getString(request, "postCallBehavior"));
        }
        if (request.containsKey("additionalComments")) {
            phoneLog.setAdditionalComments(getString(request, "additionalComments"));
        }
        if (request.containsKey("callTerminatedEarly")) {
            phoneLog.setCallTerminatedEarly(getBoolean(request, "callTerminatedEarly", false));
        }
        if (request.containsKey("terminationReason")) {
            phoneLog.setTerminationReason(getString(request, "terminationReason"));
        }

        PhoneLog saved = phoneLogRepository.save(phoneLog);
        return mapToPhoneLogResponse(saved);
    }

    /**
     * Delete a phone log (admin only)
     */
    @Transactional
    public void deletePhoneLog(Long phoneLogId) {
        if (!phoneLogRepository.existsById(phoneLogId)) {
            throw new IllegalArgumentException("Phone log not found with id: " + phoneLogId);
        }
        phoneLogRepository.deleteById(phoneLogId);
    }

    // ============ VALIDATION ============

    private void validatePhoneLogRequest(Map<String, Object> request) {
        if (!request.containsKey("residentId")) {
            throw new IllegalArgumentException("Resident ID is required");
        }
        if (!request.containsKey("callType") || getString(request, "callType").isBlank()) {
            throw new IllegalArgumentException("Call type is required");
        }
        if (!List.of("OUTGOING", "INCOMING", "LEGAL", "EMERGENCY").contains(getString(request, "callType"))) {
            throw new IllegalArgumentException("Invalid call type");
        }
        if (!request.containsKey("contactRelationship") || getString(request, "contactRelationship").isBlank()) {
            throw new IllegalArgumentException("Contact relationship is required");
        }
        if (!request.containsKey("durationMinutes")) {
            throw new IllegalArgumentException("Duration is required");
        }
        if (!request.containsKey("authorizingStaffId")) {
            throw new IllegalArgumentException("Authorizing staff ID is required");
        }
        if (!request.containsKey("monitoringStaffId")) {
            throw new IllegalArgumentException("Monitoring staff ID is required");
        }
        if (!request.containsKey("behaviorDuringCall") || getString(request, "behaviorDuringCall").isBlank()) {
            throw new IllegalArgumentException("Behavior during call is required");
        }
        if (!List.of("POSITIVE", "NEUTRAL", "AGITATED", "DISTRESSED", "CONCERNING")
                .contains(getString(request, "behaviorDuringCall"))) {
            throw new IllegalArgumentException("Invalid behavior during call");
        }
        if (!request.containsKey("postCallBehavior") || getString(request, "postCallBehavior").isBlank()) {
            throw new IllegalArgumentException("Post-call behavior is required");
        }
        if (!List.of("IMPROVED", "NO_CHANGE", "SLIGHTLY_ELEVATED", "SIGNIFICANTLY_IMPACTED", "CRISIS_LEVEL")
                .contains(getString(request, "postCallBehavior"))) {
            throw new IllegalArgumentException("Invalid post-call behavior");
        }
    }

    // ============ MAPPING ============

    private Map<String, Object> mapToPhoneLogResponse(PhoneLog phoneLog) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", phoneLog.getId());
        response.put("programId", phoneLog.getProgram().getId());
        response.put("residentId", phoneLog.getResident().getId());
        response.put("residentName", phoneLog.getResident().getFirstName() + " " + phoneLog.getResident().getLastName());
        response.put("residentNumber", phoneLog.getResident().getResidentId());
        response.put("callType", phoneLog.getCallType());
        response.put("contactRelationship", phoneLog.getContactRelationship());
        response.put("contactName", phoneLog.getContactName());
        response.put("otherRelationshipDetails", phoneLog.getOtherRelationshipDetails());
        response.put("phoneNumber", phoneLog.getPhoneNumber());
        response.put("callDateTime", phoneLog.getCallDateTime());
        response.put("durationMinutes", phoneLog.getDurationMinutes());
        
        if (phoneLog.getAuthorizingStaff() != null) {
            response.put("authorizingStaffId", phoneLog.getAuthorizingStaff().getId());
            response.put("authorizingStaffName", getFullName(phoneLog.getAuthorizingStaff()));
        }
        
        if (phoneLog.getMonitoringStaff() != null) {
            response.put("monitoringStaffId", phoneLog.getMonitoringStaff().getId());
            response.put("monitoringStaffName", getFullName(phoneLog.getMonitoringStaff()));
        }
        
        response.put("behaviorDuringCall", phoneLog.getBehaviorDuringCall());
        response.put("postCallBehavior", phoneLog.getPostCallBehavior());
        response.put("additionalComments", phoneLog.getAdditionalComments());
        response.put("callTerminatedEarly", phoneLog.getCallTerminatedEarly());
        response.put("terminationReason", phoneLog.getTerminationReason());
        
        if (phoneLog.getLoggedByStaff() != null) {
            response.put("loggedByStaffId", phoneLog.getLoggedByStaff().getId());
            response.put("loggedByStaffName", getFullName(phoneLog.getLoggedByStaff()));
        }
        
        response.put("createdAt", phoneLog.getCreatedAt());
        
        return response;
    }

    // ============ HELPER METHODS ============

    private String getFullName(User user) {
        String firstName = user.getFirstName() != null ? user.getFirstName() : "";
        String lastName = user.getLastName() != null ? user.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? user.getEmail() : fullName;
    }

    private String getString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? value.toString() : null;
    }

    private Long getLong(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).longValue();
        return Long.parseLong(value.toString());
    }

    private Integer getInteger(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).intValue();
        return Integer.parseInt(value.toString());
    }

    private Boolean getBoolean(Map<String, Object> map, String key, Boolean defaultValue) {
        Object value = map.get(key);
        if (value == null) return defaultValue;
        if (value instanceof Boolean) return (Boolean) value;
        return Boolean.parseBoolean(value.toString());
    }

    private Instant getInstant(Map<String, Object> map, String key, Instant defaultValue) {
        Object value = map.get(key);
        if (value == null) return defaultValue;
        if (value instanceof Instant) return (Instant) value;
        return Instant.parse(value.toString());
    }
}

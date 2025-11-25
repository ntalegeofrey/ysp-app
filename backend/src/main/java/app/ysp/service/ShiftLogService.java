package app.ysp.service;

import app.ysp.dto.ShiftLogRequest;
import app.ysp.dto.ShiftLogResponse;
import app.ysp.entity.Program;
import app.ysp.entity.ShiftLog;
import app.ysp.entity.ShiftLogAttachment;
import app.ysp.repo.ProgramRepository;
import app.ysp.repository.ShiftLogAttachmentRepository;
import app.ysp.repository.ShiftLogRepository;
import app.ysp.util.JsonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShiftLogService {
    
    @Autowired
    private ShiftLogRepository shiftLogRepository;
    
    @Autowired
    private ShiftLogAttachmentRepository attachmentRepository;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private StorageService storageService;
    
    /**
     * Get all shift logs for a program with pagination
     */
    public Page<ShiftLogResponse> getShiftLogs(Long programId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("shiftDate").descending().and(Sort.by("createdAt").descending()));
        Page<ShiftLog> logs = shiftLogRepository.findByProgram_IdOrderByShiftDateDescCreatedAtDesc(programId, pageable);
        return logs.map(this::convertToResponse);
    }
    
    /**
     * Get a specific shift log by ID
     */
    public ShiftLogResponse getShiftLog(Long programId, Long id) {
        ShiftLog log = shiftLogRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shift log not found"));
        
        // Verify it belongs to the correct program
        if (!log.getProgram().getId().equals(programId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Shift log does not belong to this program");
        }
        
        return convertToResponse(log);
    }
    
    /**
     * Create a new shift log
     */
    @Transactional
    public ShiftLogResponse createShiftLog(Long programId, ShiftLogRequest request) {
        // Validate program exists
        Program program = programRepository.findById(programId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Program not found"));
        
        // Check if log already exists for this program/date/shift
        shiftLogRepository.findByProgram_IdAndShiftDateAndShiftType(
            programId, 
            request.getShiftDate(), 
            request.getShiftType()
        ).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, 
                "A shift log already exists for this program, date, and shift");
        });
        
        // Create new shift log
        ShiftLog log = new ShiftLog();
        log.setProgram(program);
        updateLogFromRequest(log, request);
        
        // Save
        ShiftLog saved = shiftLogRepository.save(log);
        
        return convertToResponse(saved);
    }
    
    /**
     * Update an existing shift log
     */
    @Transactional
    public ShiftLogResponse updateShiftLog(Long programId, Long id, ShiftLogRequest request) {
        ShiftLog log = shiftLogRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shift log not found"));
        
        // Verify ownership
        if (!log.getProgram().getId().equals(programId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Shift log does not belong to this program");
        }
        
        // Update fields
        updateLogFromRequest(log, request);
        
        // Save
        ShiftLog updated = shiftLogRepository.save(log);
        
        return convertToResponse(updated);
    }
    
    /**
     * Delete a shift log
     */
    @Transactional
    public void deleteShiftLog(Long programId, Long id) {
        ShiftLog log = shiftLogRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shift log not found"));
        
        // Verify ownership
        if (!log.getProgram().getId().equals(programId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Shift log does not belong to this program");
        }
        
        // Delete (cascades to attachments)
        shiftLogRepository.delete(log);
    }
    
    /**
     * Search shift logs
     */
    public List<ShiftLogResponse> searchShiftLogs(
        Long programId,
        String query,
        String shiftType,
        String status,
        LocalDate startDate,
        LocalDate endDate
    ) {
        List<ShiftLog> logs;
        
        // Apply filters
        if (query != null && !query.trim().isEmpty()) {
            logs = shiftLogRepository.searchByProgramAndText(programId, query);
        } else if (startDate != null && endDate != null) {
            logs = shiftLogRepository.findByProgram_IdAndShiftDateBetween(programId, startDate, endDate);
        } else if (shiftType != null && !shiftType.trim().isEmpty()) {
            logs = shiftLogRepository.findByProgram_IdAndShiftType(programId, shiftType);
        } else if (status != null && !status.trim().isEmpty()) {
            logs = shiftLogRepository.findByProgram_IdAndOverallStatus(programId, status);
        } else {
            // Default: get all for program
            Pageable pageable = PageRequest.of(0, 100, Sort.by("shiftDate").descending());
            logs = shiftLogRepository.findByProgram_IdOrderByShiftDateDescCreatedAtDesc(programId, pageable).getContent();
        }
        
        return logs.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Helper: Update log entity from request
     */
    private void updateLogFromRequest(ShiftLog log, ShiftLogRequest request) {
        log.setShiftDate(request.getShiftDate());
        log.setShiftType(request.getShiftType());
        log.setUnitSupervisor(request.getUnitSupervisor());
        log.setResidentInitials(request.getResidentInitials());
        log.setResidentCount(request.getResidentCount());
        log.setResidentComments(request.getResidentComments());
        log.setIncidentsEvents(request.getIncidentsEvents());
        log.setOverallStatus(request.getOverallStatus());
        log.setFollowUpRequired(request.getFollowUpRequired());
        log.setShiftSummary(request.getShiftSummary());
        log.setStaffAssignmentsJson(request.getStaffAssignmentsJson());
        log.setEquipmentCountsJson(request.getEquipmentCountsJson());
        log.setCertificationComplete(request.getCertificationComplete() != null ? request.getCertificationComplete() : false);
        log.setCertEquipmentVerified(request.getCertEquipmentVerified() != null ? request.getCertEquipmentVerified() : false);
        log.setCertShiftEventsAccurate(request.getCertShiftEventsAccurate() != null ? request.getCertShiftEventsAccurate() : false);
        log.setReportCompletedBy(request.getReportCompletedBy());
        log.setReportCompletedByEmail(request.getReportCompletedByEmail());
        
        // Parse certification datetime
        if (request.getCertificationDatetime() != null && !request.getCertificationDatetime().trim().isEmpty()) {
            try {
                // Try parsing as ZonedDateTime first
                Instant certTime = ZonedDateTime.parse(request.getCertificationDatetime()).toInstant();
                log.setCertificationDatetime(certTime);
            } catch (DateTimeParseException e1) {
                try {
                    // Try parsing as Instant
                    Instant certTime = Instant.parse(request.getCertificationDatetime());
                    log.setCertificationDatetime(certTime);
                } catch (DateTimeParseException e2) {
                    try {
                        // Try parsing as LocalDateTime (from datetime-local input: "2024-11-25T15:30")
                        java.time.LocalDateTime localDateTime = java.time.LocalDateTime.parse(request.getCertificationDatetime());
                        // Convert to Instant using system default timezone
                        Instant certTime = localDateTime.atZone(java.time.ZoneId.systemDefault()).toInstant();
                        log.setCertificationDatetime(certTime);
                    } catch (DateTimeParseException e3) {
                        // If all parsing attempts fail, log error and set to null
                        System.err.println("Failed to parse certification datetime: " + request.getCertificationDatetime());
                        log.setCertificationDatetime(null);
                    }
                }
            }
        }
    }
    
    /**
     * Helper: Convert entity to response DTO
     */
    private ShiftLogResponse convertToResponse(ShiftLog log) {
        ShiftLogResponse response = new ShiftLogResponse();
        response.setId(log.getId());
        response.setProgramId(log.getProgram().getId());
        response.setProgramName(log.getProgram().getName());
        response.setShiftDate(log.getShiftDate());
        response.setShiftType(log.getShiftType());
        response.setUnitSupervisor(log.getUnitSupervisor());
        response.setResidentInitials(log.getResidentInitials());
        response.setResidentCount(log.getResidentCount());
        response.setResidentComments(log.getResidentComments());
        response.setIncidentsEvents(log.getIncidentsEvents());
        response.setOverallStatus(log.getOverallStatus());
        response.setFollowUpRequired(log.getFollowUpRequired());
        response.setShiftSummary(log.getShiftSummary());
        response.setCertificationComplete(log.getCertificationComplete());
        response.setCertEquipmentVerified(log.getCertEquipmentVerified());
        response.setCertShiftEventsAccurate(log.getCertShiftEventsAccurate());
        response.setCertificationDatetime(log.getCertificationDatetime());
        response.setReportCompletedBy(log.getReportCompletedBy());
        response.setReportCompletedByEmail(log.getReportCompletedByEmail());
        response.setCreatedAt(log.getCreatedAt());
        response.setUpdatedAt(log.getUpdatedAt());
        response.setStatus(log.getStatus());
        
        // Parse JSON fields
        response.setStaffAssignments(parseStaffAssignments(log.getStaffAssignmentsJson()));
        response.setEquipmentCounts(parseEquipmentCounts(log.getEquipmentCountsJson()));
        
        // Load attachments
        List<ShiftLogAttachment> attachments = attachmentRepository.findByShiftLog_Id(log.getId());
        response.setAttachments(attachments.stream()
            .map(this::convertAttachmentToInfo)
            .collect(Collectors.toList()));
        
        return response;
    }
    
    /**
     * Helper: Parse staff assignments JSON
     */
    private List<ShiftLogResponse.StaffAssignment> parseStaffAssignments(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        try {
            List<Map<String, Object>> list = JsonUtil.toList(json);
            return list.stream()
                .map(map -> {
                    ShiftLogResponse.StaffAssignment assignment = new ShiftLogResponse.StaffAssignment();
                    assignment.setName((String) map.get("name"));
                    assignment.setPosition((String) map.get("position"));
                    assignment.setDuties((String) map.get("duties"));
                    assignment.setStatus((String) map.get("status"));
                    return assignment;
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    /**
     * Helper: Parse equipment counts JSON
     */
    private Map<String, Object> parseEquipmentCounts(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new HashMap<>();
        }
        
        try {
            return JsonUtil.toMap(json);
        } catch (Exception e) {
            return new HashMap<>();
        }
    }
    
    /**
     * Helper: Convert attachment entity to info DTO
     */
    private ShiftLogResponse.AttachmentInfo convertAttachmentToInfo(ShiftLogAttachment attachment) {
        ShiftLogResponse.AttachmentInfo info = new ShiftLogResponse.AttachmentInfo();
        info.setId(attachment.getId());
        info.setFileName(attachment.getFileName());
        info.setFileType(attachment.getFileType());
        info.setFileSize(attachment.getFileSize());
        
        // Generate pre-signed URL for secure access to private bucket files
        String presignedUrl = storageService.generatePresignedUrl(attachment.getFileUrl());
        info.setFileUrl(presignedUrl);
        
        info.setUploadedAt(attachment.getUploadedAt());
        return info;
    }
    
    /**
     * Add attachment to a shift log
     */
    @Transactional
    public Map<String, Object> addAttachment(Long programId, Long logId, MultipartFile file) throws IOException {
        // Verify program and log exist
        ShiftLog log = shiftLogRepository.findById(logId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shift log not found"));
        
        if (!log.getProgram().getId().equals(programId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Shift log does not belong to this program");
        }
        
        // Upload file to storage
        String fileUrl = storageService.uploadFile(file, "shift-logs");
        
        // Create attachment record
        ShiftLogAttachment attachment = new ShiftLogAttachment();
        attachment.setShiftLog(log);
        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setFileUrl(fileUrl);
        attachment.setUploadedAt(Instant.now());
        
        ShiftLogAttachment saved = attachmentRepository.save(attachment);
        
        // Return attachment info
        Map<String, Object> result = new HashMap<>();
        result.put("id", saved.getId());
        result.put("fileName", saved.getFileName());
        result.put("fileType", saved.getFileType());
        result.put("fileSize", saved.getFileSize());
        result.put("fileUrl", saved.getFileUrl());
        result.put("uploadedAt", saved.getUploadedAt());
        
        return result;
    }
    
    /**
     * Delete attachment from a shift log
     */
    @Transactional
    public void deleteAttachment(Long programId, Long logId, Long attachmentId) {
        // Verify attachment exists and belongs to the log
        ShiftLogAttachment attachment = attachmentRepository.findById(attachmentId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attachment not found"));
        
        ShiftLog log = attachment.getShiftLog();
        if (!log.getId().equals(logId) || !log.getProgram().getId().equals(programId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Attachment does not belong to this shift log");
        }
        
        // Delete file from storage
        storageService.deleteFile(attachment.getFileUrl());
        
        // Delete attachment record
        attachmentRepository.delete(attachment);
    }
}

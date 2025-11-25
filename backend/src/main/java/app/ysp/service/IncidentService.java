package app.ysp.service;

import app.ysp.dto.IncidentReportRequest;
import app.ysp.dto.IncidentReportResponse;
import app.ysp.dto.ShakedownReportRequest;
import app.ysp.dto.ShakedownReportResponse;
import app.ysp.entity.IncidentReport;
import app.ysp.entity.ShakedownReport;
import app.ysp.entity.Program;
import app.ysp.repo.IncidentReportRepository;
import app.ysp.repo.ShakedownReportRepository;
import app.ysp.repo.ProgramRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentReportRepository incidentReportRepository;
    private final ShakedownReportRepository shakedownReportRepository;
    private final ProgramRepository programRepository;

    public IncidentService(IncidentReportRepository incidentReportRepository,
                          ShakedownReportRepository shakedownReportRepository,
                          ProgramRepository programRepository) {
        this.incidentReportRepository = incidentReportRepository;
        this.shakedownReportRepository = shakedownReportRepository;
        this.programRepository = programRepository;
    }

    // ============ INCIDENT REPORTS ============

    public List<IncidentReportResponse> getAllIncidentReports(Long programId) {
        List<IncidentReport> reports = incidentReportRepository.findByProgramIdOrderByDateDesc(programId);
        return reports.stream()
                .map(this::mapToIncidentResponse)
                .collect(Collectors.toList());
    }

    public Optional<IncidentReportResponse> getIncidentReportById(Long id) {
        return incidentReportRepository.findById(id)
                .map(this::mapToIncidentResponse);
    }

    @Transactional
    public IncidentReportResponse createIncidentReport(Long programId, IncidentReportRequest request) {
        // Validate required fields
        validateIncidentReportRequest(request);

        // Get program
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found with id: " + programId));

        // Create entity from DTO
        IncidentReport report = mapToIncidentEntity(request);
        report.setProgram(program);

        // Set defaults if not provided
        if (report.getSignatureDatetime() == null) {
            report.setSignatureDatetime(LocalDateTime.now());
        }
        if (report.getStatus() == null) {
            report.setStatus("Submitted");
        }

        // Save and return
        IncidentReport saved = incidentReportRepository.save(report);
        return mapToIncidentResponse(saved);
    }

    private void validateIncidentReportRequest(IncidentReportRequest request) {
        if (request.getIncidentDate() == null) {
            throw new IllegalArgumentException("Incident date is required");
        }
        if (request.getIncidentTime() == null) {
            throw new IllegalArgumentException("Incident time is required");
        }
        if (request.getNatureOfIncident() == null || request.getNatureOfIncident().isBlank()) {
            throw new IllegalArgumentException("Nature of incident is required");
        }
        if (request.getDetailedDescription() == null || request.getDetailedDescription().isBlank()) {
            throw new IllegalArgumentException("Detailed description is required");
        }
        if (request.getReportCompletedBy() == null || request.getReportCompletedBy().isBlank()) {
            throw new IllegalArgumentException("Report completed by is required");
        }
    }

    private IncidentReport mapToIncidentEntity(IncidentReportRequest request) {
        IncidentReport report = new IncidentReport();
        report.setIncidentDate(request.getIncidentDate());
        report.setIncidentTime(request.getIncidentTime());
        report.setShift(request.getShift());
        report.setAreaOfIncident(request.getAreaOfIncident());
        report.setNatureOfIncident(request.getNatureOfIncident());
        report.setResidentsInvolved(request.getResidentsInvolved());
        report.setStaffInvolved(request.getStaffInvolved());
        report.setResidentWitnesses(request.getResidentWitnesses());
        report.setPrimaryStaffRestraint(request.getPrimaryStaffRestraint());
        report.setMechanicalsStartTime(request.getMechanicalsStartTime());
        report.setMechanicalsFinishTime(request.getMechanicalsFinishTime());
        report.setRoomConfinementStartTime(request.getRoomConfinementStartTime());
        report.setRoomConfinementFinishTime(request.getRoomConfinementFinishTime());
        report.setStaffPopulation(request.getStaffPopulation());
        report.setYouthPopulation(request.getYouthPopulation());
        report.setDetailedDescription(request.getDetailedDescription());
        report.setReportCompletedBy(request.getReportCompletedBy());
        report.setReportCompletedByEmail(request.getReportCompletedByEmail());
        report.setSignatureDatetime(request.getSignatureDatetime());
        report.setCertificationComplete(request.getCertificationComplete());
        report.setCreatedBy(request.getCreatedBy());
        return report;
    }

    private IncidentReportResponse mapToIncidentResponse(IncidentReport report) {
        IncidentReportResponse response = new IncidentReportResponse();
        response.setId(report.getId());
        response.setProgramId(report.getProgram().getId());
        response.setProgramName(report.getProgram().getName());
        response.setIncidentDate(report.getIncidentDate());
        response.setIncidentTime(report.getIncidentTime());
        response.setShift(report.getShift());
        response.setAreaOfIncident(report.getAreaOfIncident());
        response.setNatureOfIncident(report.getNatureOfIncident());
        response.setResidentsInvolved(report.getResidentsInvolved());
        response.setStaffInvolved(report.getStaffInvolved());
        response.setResidentWitnesses(report.getResidentWitnesses());
        response.setPrimaryStaffRestraint(report.getPrimaryStaffRestraint());
        response.setMechanicalsStartTime(report.getMechanicalsStartTime());
        response.setMechanicalsFinishTime(report.getMechanicalsFinishTime());
        response.setRoomConfinementStartTime(report.getRoomConfinementStartTime());
        response.setRoomConfinementFinishTime(report.getRoomConfinementFinishTime());
        response.setStaffPopulation(report.getStaffPopulation());
        response.setYouthPopulation(report.getYouthPopulation());
        response.setDetailedDescription(report.getDetailedDescription());
        response.setReportCompletedBy(report.getReportCompletedBy());
        response.setReportCompletedByEmail(report.getReportCompletedByEmail());
        response.setSignatureDatetime(report.getSignatureDatetime());
        response.setCertificationComplete(report.getCertificationComplete());
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setCreatedBy(report.getCreatedBy());
        response.setStatus(report.getStatus());
        response.setPriority(report.getPriority());
        response.setReviewedBy(report.getReviewedBy());
        response.setReviewedAt(report.getReviewedAt());
        return response;
    }

    // ============ SHAKEDOWN REPORTS ============

    public List<ShakedownReportResponse> getAllShakedownReports(Long programId) {
        List<ShakedownReport> reports = shakedownReportRepository.findByProgramIdOrderByDateDesc(programId);
        return reports.stream()
                .map(this::mapToShakedownResponse)
                .collect(Collectors.toList());
    }

    public Optional<ShakedownReportResponse> getShakedownReportById(Long id) {
        return shakedownReportRepository.findById(id)
                .map(this::mapToShakedownResponse);
    }

    @Transactional
    public ShakedownReportResponse createShakedownReport(Long programId, ShakedownReportRequest request) {
        // Validate required fields
        validateShakedownReportRequest(request);

        // Get program
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found with id: " + programId));

        // Create entity from DTO
        ShakedownReport report = mapToShakedownEntity(request);
        report.setProgram(program);

        // Set defaults if not provided
        if (report.getSignatureDatetime() == null) {
            report.setSignatureDatetime(LocalDateTime.now());
        }
        if (report.getStatus() == null) {
            report.setStatus("Submitted");
        }
        if (report.getContrabandFound() == null) {
            report.setContrabandFound(false);
        }

        // Save and return
        ShakedownReport saved = shakedownReportRepository.save(report);
        return mapToShakedownResponse(saved);
    }

    private void validateShakedownReportRequest(ShakedownReportRequest request) {
        if (request.getShakedownDate() == null) {
            throw new IllegalArgumentException("Shakedown date is required");
        }
        if (request.getReportCompletedBy() == null || request.getReportCompletedBy().isBlank()) {
            throw new IllegalArgumentException("Report completed by is required");
        }
    }

    private ShakedownReport mapToShakedownEntity(ShakedownReportRequest request) {
        ShakedownReport report = new ShakedownReport();
        report.setShakedownDate(request.getShakedownDate());
        report.setShift(request.getShift());
        report.setCommonAreaSearches(request.getCommonAreaSearches());
        report.setSchoolAreaSearches(request.getSchoolAreaSearches());
        report.setResidentRoomSearches(request.getResidentRoomSearches());
        report.setEquipmentCondition(request.getEquipmentCondition());
        report.setAnnouncementTime(request.getAnnouncementTime());
        report.setAnnouncementStaff(request.getAnnouncementStaff());
        report.setAnnouncementAreas(request.getAnnouncementAreas());
        report.setAdditionalComments(request.getAdditionalComments());
        report.setReportCompletedBy(request.getReportCompletedBy());
        report.setReportCompletedByEmail(request.getReportCompletedByEmail());
        report.setSignatureDatetime(request.getSignatureDatetime());
        report.setCertificationComplete(request.getCertificationComplete());
        report.setContrabandFound(request.getContrabandFound());
        report.setCreatedBy(request.getCreatedBy());
        return report;
    }

    private ShakedownReportResponse mapToShakedownResponse(ShakedownReport report) {
        ShakedownReportResponse response = new ShakedownReportResponse();
        response.setId(report.getId());
        response.setProgramId(report.getProgram().getId());
        response.setProgramName(report.getProgram().getName());
        response.setShakedownDate(report.getShakedownDate());
        response.setShift(report.getShift());
        response.setCommonAreaSearches(report.getCommonAreaSearches());
        response.setSchoolAreaSearches(report.getSchoolAreaSearches());
        response.setResidentRoomSearches(report.getResidentRoomSearches());
        response.setEquipmentCondition(report.getEquipmentCondition());
        response.setAnnouncementTime(report.getAnnouncementTime());
        response.setAnnouncementStaff(report.getAnnouncementStaff());
        response.setAnnouncementAreas(report.getAnnouncementAreas());
        response.setAdditionalComments(report.getAdditionalComments());
        response.setReportCompletedBy(report.getReportCompletedBy());
        response.setReportCompletedByEmail(report.getReportCompletedByEmail());
        response.setSignatureDatetime(report.getSignatureDatetime());
        response.setCertificationComplete(report.getCertificationComplete());
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setCreatedBy(report.getCreatedBy());
        response.setStatus(report.getStatus());
        response.setContrabandFound(report.getContrabandFound());
        response.setReviewedBy(report.getReviewedBy());
        response.setReviewedAt(report.getReviewedAt());
        return response;
    }
}

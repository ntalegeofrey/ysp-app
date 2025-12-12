package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.CensusRequest;
import app.ysp.dto.CensusResponse;
import app.ysp.entity.*;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repository.CensusRepository;
import app.ysp.repository.CensusEntryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CensusService {
    private final CensusRepository censusRepository;
    private final CensusEntryRepository censusEntryRepository;
    private final ProgramRepository programRepository;
    private final UserRepository userRepository;
    private final ProgramResidentRepository residentRepository;
    private final ProgramAssignmentRepository assignmentRepository;
    private final MailService mailService;
    private final TemplateEngine templateEngine;
    private final SseHub sseHub;

    public CensusService(
            CensusRepository censusRepository,
            CensusEntryRepository censusEntryRepository,
            ProgramRepository programRepository,
            UserRepository userRepository,
            ProgramResidentRepository residentRepository,
            ProgramAssignmentRepository assignmentRepository,
            MailService mailService,
            TemplateEngine templateEngine,
            SseHub sseHub) {
        this.censusRepository = censusRepository;
        this.censusEntryRepository = censusEntryRepository;
        this.programRepository = programRepository;
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
        this.assignmentRepository = assignmentRepository;
        this.mailService = mailService;
        this.templateEngine = templateEngine;
        this.sseHub = sseHub;
    }

    /**
     * Get all censuses for a program
     */
    public List<CensusResponse> getCensuses(Long programId) {
        List<Census> censuses = censusRepository.findByProgram_IdOrderByCensusDateDescCreatedAtDesc(programId);
        return censuses.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get census by ID with entries
     */
    public CensusResponse getCensusById(Long programId, Long censusId) {
        Census census = censusRepository.findById(censusId)
                .orElseThrow(() -> new RuntimeException("Census not found"));
        
        if (!census.getProgram().getId().equals(programId)) {
            throw new RuntimeException("Census does not belong to this program");
        }
        
        return mapToResponseWithEntries(census);
    }

    /**
     * Save census (create or update)
     */
    @Transactional
    public CensusResponse saveCensus(Long programId, Long staffId, CensusRequest request) {
        // Check for duplicates
        if (censusRepository.existsByProgram_IdAndCensusDateAndShift(
                programId, request.getCensusDate(), request.getShift())) {
            throw new RuntimeException("Census already exists for this date and shift");
        }

        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new RuntimeException("Program not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Calculate counts
        int dysCount = 0;
        int nonDysCount = 0;
        for (CensusRequest.CensusEntryRequest entryReq : request.getEntries()) {
            if ("DYS".equalsIgnoreCase(entryReq.getStatus())) {
                dysCount++;
            } else if ("NON_DYS".equalsIgnoreCase(entryReq.getStatus())) {
                nonDysCount++;
            }
        }

        // Create census
        Census census = new Census();
        census.setProgram(program);
        census.setCensusDate(request.getCensusDate());
        census.setShift(request.getShift());
        census.setConductedBy(staff);
        String conductorName = staff.getFullName();
        if (conductorName == null || conductorName.isBlank()) {
            String first = staff.getFirstName() == null ? "" : staff.getFirstName();
            String last = staff.getLastName() == null ? "" : staff.getLastName();
            conductorName = (first + " " + last).trim();
        }
        if (conductorName == null || conductorName.isBlank()) {
            conductorName = staff.getEmail();
        }
        census.setConductorName(conductorName);
        census.setTotalResidents(request.getEntries().size());
        census.setDysCount(dysCount);
        census.setNonDysCount(nonDysCount);
        census.setSaved(true);

        Census savedCensus = censusRepository.save(census);

        // Save entries
        for (CensusRequest.CensusEntryRequest entryReq : request.getEntries()) {
            ProgramResident resident = residentRepository.findById(entryReq.getResidentId())
                    .orElseThrow(() -> new RuntimeException("Resident not found: " + entryReq.getResidentId()));

            CensusEntry entry = new CensusEntry();
            entry.setCensus(savedCensus);
            entry.setResident(resident);
            entry.setResidentName(entryReq.getResidentName());
            entry.setStatus(entryReq.getStatus());
            entry.setComments(entryReq.getComments());

            censusEntryRepository.save(entry);
        }

        // Send email if requested
        if (request.isSendEmail()) {
            try {
                sendCensusNotificationEmail(program, savedCensus, dysCount, nonDysCount);
            } catch (Exception e) {
                System.err.println("[WARN] Failed to send census notification email: " + e.getMessage());
            }
        }

        // Broadcast SSE event for real-time archive updates
        try {
            sseHub.broadcast(Map.of(
                    "type", "census.submitted",
                    "programId", programId,
                    "censusId", savedCensus.getId()
            ));
        } catch (Exception ignored) {}

        return mapToResponseWithEntries(savedCensus);
    }

    /**
     * Send email notification to PDS and ASPD when census is submitted
     */
    private void sendCensusNotificationEmail(Program program, Census census, int dysCount, int nonDysCount) {
        // Get PDS and ASPD users for this program
        List<String> recipients = new ArrayList<>();

        // Find PDS and ASPD assignments
        List<ProgramAssignment> assignments = assignmentRepository.findByProgram_Id(program.getId());
        for (ProgramAssignment assignment : assignments) {
            String roleType = assignment.getRoleType();
            if (roleType != null &&
                (roleType.equalsIgnoreCase("PDS") ||
                 roleType.equalsIgnoreCase("ASPD") ||
                 roleType.equalsIgnoreCase("PROGRAM_DIRECTOR") ||
                 roleType.equalsIgnoreCase("ASSISTANT_DIRECTOR"))) {
                String email = assignment.getUserEmail();
                if (email != null && !email.isBlank()) {
                    recipients.add(email);
                }
            }
        }

        if (recipients.isEmpty()) {
            System.out.println("[INFO] No PDS/ASPD/Directors found for program " + program.getId() + ", skipping census notification");
            return;
        }

        // Build email content
        String subject = String.format("Residential Census Submitted - %s", program.getName());

        Context context = new Context();
        context.setVariable("programName", program.getName());
        context.setVariable("conductorName", census.getConductorName());
        context.setVariable("censusDate", census.getCensusDate().toString());
        context.setVariable("shift", census.getShift());
        context.setVariable("totalResidents", census.getTotalResidents());
        context.setVariable("dysCount", dysCount);
        context.setVariable("nonDysCount", nonDysCount);

        String html = templateEngine.process("census-notification", context);

        // Send to all PDS, ASPD, and Directors
        for (String email : recipients) {
            mailService.sendRawHtml(email, subject, html);
            System.out.println("[INFO] Sent census notification email to: " + email);
        }
    }

    /**
     * Map Census to response without entries
     */
    private CensusResponse mapToResponse(Census census) {
        CensusResponse response = new CensusResponse();
        response.setId(census.getId());
        response.setCensusDate(census.getCensusDate());
        response.setShift(census.getShift());
        response.setConductedBy(census.getConductorName());
        response.setTotalResidents(census.getTotalResidents());
        response.setDysCount(census.getDysCount());
        response.setNonDysCount(census.getNonDysCount());
        response.setCreatedAt(census.getCreatedAt());
        response.setEntries(new ArrayList<>());
        return response;
    }

    /**
     * Map Census to response with entries
     */
    private CensusResponse mapToResponseWithEntries(Census census) {
        CensusResponse response = mapToResponse(census);

        List<CensusEntry> entries = censusEntryRepository.findByCensusId(census.getId());
        List<CensusResponse.CensusEntryResponse> entryResponses = entries.stream()
                .map(entry -> {
                    CensusResponse.CensusEntryResponse entryResponse = new CensusResponse.CensusEntryResponse();
                    entryResponse.setId(entry.getId());
                    entryResponse.setResidentId(entry.getResident().getId());
                    entryResponse.setResidentName(entry.getResidentName());
                    entryResponse.setStatus(entry.getStatus());
                    entryResponse.setComments(entry.getComments());
                    return entryResponse;
                })
                .collect(Collectors.toList());

        response.setEntries(entryResponses);
        return response;
    }
}

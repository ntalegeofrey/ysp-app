package app.ysp.service;

import app.ysp.dto.RepairInterventionRequest;
import app.ysp.dto.RepairInterventionResponse;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.entity.RepairIntervention;
import app.ysp.domain.User;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repo.RepairInterventionRepository;
import app.ysp.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RepairInterventionService {

    private final RepairInterventionRepository repairRepo;
    private final ProgramRepository programRepo;
    private final ProgramResidentRepository residentRepo;
    private final UserRepository userRepo;

    public RepairInterventionService(
            RepairInterventionRepository repairRepo,
            ProgramRepository programRepo,
            ProgramResidentRepository residentRepo,
            UserRepository userRepo) {
        this.repairRepo = repairRepo;
        this.programRepo = programRepo;
        this.residentRepo = residentRepo;
        this.userRepo = userRepo;
    }

    public List<RepairInterventionResponse> getAllRepairInterventions(Long programId) {
        return repairRepo.findByProgram_IdOrderByCreatedAtDesc(programId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<RepairInterventionResponse> getRepairInterventionById(Long id) {
        return repairRepo.findById(id).map(this::toResponse);
    }

    @Transactional
    public RepairInterventionResponse createRepairIntervention(
            Long programId,
            RepairInterventionRequest request,
            String userEmail) {
        
        Program program = programRepo.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        ProgramResident resident = residentRepo.findById(request.getResidentId())
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));

        User assigningStaff = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        RepairIntervention repair = new RepairIntervention();
        repair.setProgram(program);
        repair.setResident(resident);
        repair.setInfractionDate(request.getInfractionDate());
        repair.setInfractionShift(request.getInfractionShift());
        repair.setInfractionBehavior(request.getInfractionBehavior());
        repair.setRepairLevel(request.getRepairLevel());
        repair.setInterventionsJson(request.getInterventionsJson());
        repair.setComments(request.getComments());
        repair.setReviewDate(request.getReviewDate());
        
        // Set assigning staff info
        repair.setAssigningStaffId(assigningStaff.getId());
        String staffName = (assigningStaff.getFirstName() != null ? assigningStaff.getFirstName() : "") + 
                          " " + 
                          (assigningStaff.getLastName() != null ? assigningStaff.getLastName() : "");
        repair.setAssigningStaffName(staffName.trim());
        
        repair.setStatus("pending_review");
        repair.setCreatedAt(Instant.now());
        repair.setUpdatedAt(Instant.now());

        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    @Transactional
    public RepairInterventionResponse approvePD(Long id, String userEmail) {
        RepairIntervention repair = repairRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repair intervention not found"));

        User reviewer = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        repair.setReviewedByPdId(reviewer.getId());
        String reviewerName = (reviewer.getFirstName() != null ? reviewer.getFirstName() : "") + 
                             " " + 
                             (reviewer.getLastName() != null ? reviewer.getLastName() : "");
        repair.setReviewedByPdName(reviewerName.trim());
        repair.setReviewedByPdAt(Instant.now());
        repair.setUpdatedAt(Instant.now());

        // Update status if both approvals are done
        if (repair.getReviewedByClinicalAt() != null) {
            repair.setStatus("approved");
        }

        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    @Transactional
    public RepairInterventionResponse approveClinical(Long id, String userEmail) {
        RepairIntervention repair = repairRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Repair intervention not found"));

        User reviewer = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        repair.setReviewedByClinicalId(reviewer.getId());
        String reviewerName = (reviewer.getFirstName() != null ? reviewer.getFirstName() : "") + 
                             " " + 
                             (reviewer.getLastName() != null ? reviewer.getLastName() : "");
        repair.setReviewedByClinicalName(reviewerName.trim());
        repair.setReviewedByClinicalAt(Instant.now());
        repair.setUpdatedAt(Instant.now());

        // Update status if both approvals are done
        if (repair.getReviewedByPdAt() != null) {
            repair.setStatus("approved");
        }

        RepairIntervention saved = repairRepo.save(repair);
        return toResponse(saved);
    }

    private RepairInterventionResponse toResponse(RepairIntervention repair) {
        RepairInterventionResponse response = new RepairInterventionResponse();
        response.setId(repair.getId());
        response.setProgramId(repair.getProgram() != null ? repair.getProgram().getId() : null);
        response.setResidentId(repair.getResident() != null ? repair.getResident().getId() : null);
        
        if (repair.getResident() != null) {
            response.setResidentName(repair.getResident().getFullName());
            response.setResidentNumber(repair.getResident().getResidentId());
        }
        
        response.setInfractionDate(repair.getInfractionDate());
        response.setInfractionShift(repair.getInfractionShift());
        response.setInfractionBehavior(repair.getInfractionBehavior());
        response.setAssigningStaffId(repair.getAssigningStaffId());
        response.setAssigningStaffName(repair.getAssigningStaffName());
        response.setRepairLevel(repair.getRepairLevel());
        response.setInterventionsJson(repair.getInterventionsJson());
        response.setComments(repair.getComments());
        response.setReviewDate(repair.getReviewDate());
        response.setReviewedByPdId(repair.getReviewedByPdId());
        response.setReviewedByPdName(repair.getReviewedByPdName());
        response.setReviewedByPdAt(repair.getReviewedByPdAt());
        response.setReviewedByClinicalId(repair.getReviewedByClinicalId());
        response.setReviewedByClinicalName(repair.getReviewedByClinicalName());
        response.setReviewedByClinicalAt(repair.getReviewedByClinicalAt());
        response.setStatus(repair.getStatus());
        response.setCreatedAt(repair.getCreatedAt());
        response.setUpdatedAt(repair.getUpdatedAt());
        
        return response;
    }
}

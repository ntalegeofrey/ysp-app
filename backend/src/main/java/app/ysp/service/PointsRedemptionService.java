package app.ysp.service;

import app.ysp.dto.PointsRedemptionRequest;
import app.ysp.dto.PointsRedemptionResponse;
import app.ysp.entity.PointsDiaryCard;
import app.ysp.entity.PointsRedemption;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.domain.User;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repo.UserRepository;
import app.ysp.repository.PointsDiaryCardRepository;
import app.ysp.repository.PointsRedemptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PointsRedemptionService {

    private final PointsRedemptionRepository redemptionRepo;
    private final PointsDiaryCardRepository diaryCardRepo;
    private final ProgramRepository programRepo;
    private final ProgramResidentRepository residentRepo;
    private final UserRepository userRepo;
    private final PointsManagementService pointsService;

    public PointsRedemptionService(
            PointsRedemptionRepository redemptionRepo,
            PointsDiaryCardRepository diaryCardRepo,
            ProgramRepository programRepo,
            ProgramResidentRepository residentRepo,
            UserRepository userRepo,
            PointsManagementService pointsService) {
        this.redemptionRepo = redemptionRepo;
        this.diaryCardRepo = diaryCardRepo;
        this.programRepo = programRepo;
        this.residentRepo = residentRepo;
        this.userRepo = userRepo;
        this.pointsService = pointsService;
    }

    public List<PointsRedemptionResponse> getRedemptionsByResident(Long residentId) {
        return redemptionRepo.findByResident_IdOrderByRedemptionDateDesc(residentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PointsRedemptionResponse> getRedemptionsByProgram(Long programId) {
        return redemptionRepo.findByProgram_IdOrderByRedemptionDateDesc(programId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PointsRedemptionResponse> getPendingRedemptions(Long programId) {
        return redemptionRepo.findPendingRedemptionsByProgram(programId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PointsRedemptionResponse submitRedemption(
            Long programId,
            PointsRedemptionRequest request) {
        
        Program program = programRepo.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        ProgramResident resident = residentRepo.findById(request.getResidentId())
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));

        // Validate resident has enough points
        Optional<PointsDiaryCard> currentCard = pointsService.getCurrentWeekDiaryCardEntity(request.getResidentId());
        if (currentCard.isEmpty()) {
            throw new IllegalArgumentException("No active diary card found for resident");
        }

        int availablePoints = currentCard.get().getCurrentBalance();
        if (availablePoints < request.getPointsRedeemed()) {
            throw new IllegalArgumentException(
                    "Insufficient points. Available: " + availablePoints + 
                    ", Requested: " + request.getPointsRedeemed());
        }

        PointsRedemption redemption = new PointsRedemption();
        redemption.setProgram(program);
        redemption.setResident(resident);
        redemption.setDiaryCard(currentCard.get());
        redemption.setRedemptionDate(request.getRedemptionDate());
        redemption.setPointsRedeemed(request.getPointsRedeemed());
        redemption.setRewardItem(request.getRewardItem());
        redemption.setCustomItem(request.getCustomItem() != null ? request.getCustomItem() : false);
        redemption.setApprovalStatus("pending");
        redemption.setCreatedAt(Instant.now());
        redemption.setUpdatedAt(Instant.now());

        PointsRedemption saved = redemptionRepo.save(redemption);
        return toResponse(saved);
    }

    @Transactional
    public PointsRedemptionResponse approveRedemption(
            Long redemptionId,
            String approvalComments,
            String userEmail) {
        
        PointsRedemption redemption = redemptionRepo.findById(redemptionId)
                .orElseThrow(() -> new IllegalArgumentException("Redemption not found"));

        if (!"pending".equals(redemption.getApprovalStatus())) {
            throw new IllegalArgumentException("Redemption has already been processed");
        }

        User approver = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        redemption.setApprovalStatus("approved");
        redemption.setApprovedByStaffId(approver.getId());
        String approverName = (approver.getFirstName() != null ? approver.getFirstName() : "") + 
                             " " + 
                             (approver.getLastName() != null ? approver.getLastName() : "");
        redemption.setApprovedByStaffName(approverName.trim());
        redemption.setApprovedAt(Instant.now());
        redemption.setApprovalComments(approvalComments);
        redemption.setUpdatedAt(Instant.now());

        // Update diary card balance
        if (redemption.getDiaryCard() != null) {
            PointsDiaryCard card = redemption.getDiaryCard();
            int newBalance = card.getCurrentBalance() - redemption.getPointsRedeemed();
            card.setCurrentBalance(newBalance);
            card.setUpdatedAt(Instant.now());
            diaryCardRepo.save(card);
        }

        PointsRedemption saved = redemptionRepo.save(redemption);
        return toResponse(saved);
    }

    @Transactional
    public PointsRedemptionResponse rejectRedemption(
            Long redemptionId,
            String rejectionComments,
            String userEmail) {
        
        PointsRedemption redemption = redemptionRepo.findById(redemptionId)
                .orElseThrow(() -> new IllegalArgumentException("Redemption not found"));

        if (!"pending".equals(redemption.getApprovalStatus())) {
            throw new IllegalArgumentException("Redemption has already been processed");
        }

        User approver = userRepo.findByEmailIgnoreCase(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        redemption.setApprovalStatus("rejected");
        redemption.setApprovedByStaffId(approver.getId());
        String approverName = (approver.getFirstName() != null ? approver.getFirstName() : "") + 
                             " " + 
                             (approver.getLastName() != null ? approver.getLastName() : "");
        redemption.setApprovedByStaffName(approverName.trim());
        redemption.setApprovedAt(Instant.now());
        redemption.setApprovalComments(rejectionComments);
        redemption.setUpdatedAt(Instant.now());

        PointsRedemption saved = redemptionRepo.save(redemption);
        return toResponse(saved);
    }

    private PointsRedemptionResponse toResponse(PointsRedemption redemption) {
        PointsRedemptionResponse response = new PointsRedemptionResponse();
        response.setId(redemption.getId());
        response.setProgramId(redemption.getProgram() != null ? redemption.getProgram().getId() : null);
        response.setResidentId(redemption.getResident() != null ? redemption.getResident().getId() : null);
        
        if (redemption.getResident() != null) {
            response.setResidentName(redemption.getResident().getFullName());
            response.setResidentNumber(redemption.getResident().getResidentId());
        }
        
        response.setDiaryCardId(redemption.getDiaryCard() != null ? redemption.getDiaryCard().getId() : null);
        response.setRedemptionDate(redemption.getRedemptionDate());
        response.setPointsRedeemed(redemption.getPointsRedeemed());
        response.setRewardItem(redemption.getRewardItem());
        response.setCustomItem(redemption.getCustomItem());
        response.setApprovedByStaffId(redemption.getApprovedByStaffId());
        response.setApprovedByStaffName(redemption.getApprovedByStaffName());
        response.setApprovedAt(redemption.getApprovedAt());
        response.setApprovalStatus(redemption.getApprovalStatus());
        response.setApprovalComments(redemption.getApprovalComments());
        response.setCreatedAt(redemption.getCreatedAt());
        response.setUpdatedAt(redemption.getUpdatedAt());
        
        return response;
    }
}

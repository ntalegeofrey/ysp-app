package app.ysp.service;

import app.ysp.dto.PointsDiaryCardRequest;
import app.ysp.dto.PointsDiaryCardResponse;
import app.ysp.entity.PointsDiaryCard;
import app.ysp.entity.Program;
import app.ysp.entity.ProgramResident;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.ProgramResidentRepository;
import app.ysp.repository.PointsDiaryCardRepository;
import app.ysp.repository.PointsRedemptionRepository;
import app.ysp.util.JsonUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PointsManagementService {

    private final PointsDiaryCardRepository diaryCardRepo;
    private final PointsRedemptionRepository redemptionRepo;
    private final ProgramRepository programRepo;
    private final ProgramResidentRepository residentRepo;

    public PointsManagementService(
            PointsDiaryCardRepository diaryCardRepo,
            PointsRedemptionRepository redemptionRepo,
            ProgramRepository programRepo,
            ProgramResidentRepository residentRepo) {
        this.diaryCardRepo = diaryCardRepo;
        this.redemptionRepo = redemptionRepo;
        this.programRepo = programRepo;
        this.residentRepo = residentRepo;
    }

    public List<PointsDiaryCardResponse> getDiaryCardsByResident(Long residentId) {
        return diaryCardRepo.findByResident_IdOrderByWeekStartDateDesc(residentId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public Optional<PointsDiaryCardResponse> getCurrentWeekDiaryCard(Long residentId) {
        LocalDate now = LocalDate.now();
        LocalDate weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = weekStart.plusDays(6);
        
        Optional<PointsDiaryCard> existing = diaryCardRepo.findByResident_IdAndWeekStartDate(residentId, weekStart);
        
        if (existing.isPresent()) {
            return existing.map(this::toResponse);
        }
        
        // Auto-create diary card for current week if it doesn't exist
        ProgramResident resident = residentRepo.findById(residentId).orElse(null);
        if (resident == null || resident.getProgram() == null) {
            return Optional.empty();
        }
        
        PointsDiaryCard newCard = new PointsDiaryCard();
        newCard.setProgram(resident.getProgram());
        newCard.setResident(resident);
        newCard.setWeekStartDate(weekStart);
        newCard.setWeekEndDate(weekEnd);
        
        // Get previous week's balance for starting points
        LocalDate prevWeekStart = weekStart.minusWeeks(1);
        Optional<PointsDiaryCard> prevCard = diaryCardRepo.findByResident_IdAndWeekStartDate(residentId, prevWeekStart);
        int startingPoints = prevCard.map(PointsDiaryCard::getCurrentBalance).orElse(0);
        
        newCard.setStartingPoints(startingPoints);
        newCard.setCurrentBalance(startingPoints);
        newCard.setTotalPointsEarned(0);
        newCard.setStatus("active");
        newCard.setCreatedAt(Instant.now());
        newCard.setUpdatedAt(Instant.now());
        
        PointsDiaryCard saved = diaryCardRepo.save(newCard);
        return Optional.of(toResponse(saved));
    }

    public Optional<PointsDiaryCard> getCurrentWeekDiaryCardEntity(Long residentId) {
        LocalDate now = LocalDate.now();
        LocalDate weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        return diaryCardRepo.findByResident_IdAndWeekStartDate(residentId, weekStart);
    }

    @Transactional
    public PointsDiaryCardResponse createOrUpdateDiaryCard(
            Long programId,
            PointsDiaryCardRequest request) {
        
        Program program = programRepo.findById(programId)
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        ProgramResident resident = residentRepo.findById(request.getResidentId())
                .orElseThrow(() -> new IllegalArgumentException("Resident not found"));

        // Check if diary card exists for this week
        Optional<PointsDiaryCard> existingCard = diaryCardRepo
                .findByResident_IdAndWeekStartDate(request.getResidentId(), request.getWeekStartDate());

        PointsDiaryCard diaryCard;
        if (existingCard.isPresent()) {
            diaryCard = existingCard.get();
        } else {
            diaryCard = new PointsDiaryCard();
            diaryCard.setProgram(program);
            diaryCard.setResident(resident);
            diaryCard.setWeekStartDate(request.getWeekStartDate());
            diaryCard.setWeekEndDate(request.getWeekEndDate());
            
            // Get previous week's balance for starting points
            LocalDate prevWeekStart = request.getWeekStartDate().minusWeeks(1);
            Optional<PointsDiaryCard> prevCard = diaryCardRepo
                    .findByResident_IdAndWeekStartDate(request.getResidentId(), prevWeekStart);
            
            int startingPoints = prevCard.map(PointsDiaryCard::getCurrentBalance).orElse(0);
            diaryCard.setStartingPoints(startingPoints);
            diaryCard.setCreatedAt(Instant.now());
        }

        // Update daily points and redemptions
        diaryCard.setDailyPointsJson(request.getDailyPointsJson());
        diaryCard.setDailyRedemptionsJson(request.getDailyRedemptionsJson());
        diaryCard.setUpdatedAt(Instant.now());
        
        // Calculate total points earned from JSON
        int totalEarned = calculateTotalPointsFromJson(request.getDailyPointsJson());
        diaryCard.setTotalPointsEarned(totalEarned);
        
        // Calculate total redeemed from JSON if available, otherwise from repo
        int totalRedeemed = 0;
        if (request.getDailyRedemptionsJson() != null && !request.getDailyRedemptionsJson().isEmpty()) {
            totalRedeemed = calculateTotalRedemptionsFromJson(request.getDailyRedemptionsJson());
        } else {
            totalRedeemed = redemptionRepo.getTotalPointsRedeemedByResidentInPeriod(
                    request.getResidentId(),
                    request.getWeekStartDate(),
                    request.getWeekEndDate()
            );
        }
        
        int currentBalance = diaryCard.getStartingPoints() + totalEarned - totalRedeemed;
        diaryCard.setCurrentBalance(currentBalance);

        PointsDiaryCard saved = diaryCardRepo.save(diaryCard);
        return toResponse(saved);
    }

    @Transactional
    public PointsDiaryCardResponse updateDailyPoints(Long cardId, String dailyPointsJson) {
        PointsDiaryCard diaryCard = diaryCardRepo.findById(cardId)
                .orElseThrow(() -> new IllegalArgumentException("Diary card not found"));

        diaryCard.setDailyPointsJson(dailyPointsJson);
        diaryCard.setUpdatedAt(Instant.now());

        // Recalculate totals
        int totalEarned = calculateTotalPointsFromJson(dailyPointsJson);
        diaryCard.setTotalPointsEarned(totalEarned);

        // Calculate redemptions from JSON if available
        int totalRedeemed = 0;
        if (diaryCard.getDailyRedemptionsJson() != null && !diaryCard.getDailyRedemptionsJson().isEmpty()) {
            totalRedeemed = calculateTotalRedemptionsFromJson(diaryCard.getDailyRedemptionsJson());
        } else {
            totalRedeemed = redemptionRepo.getTotalPointsRedeemedByResidentInPeriod(
                    diaryCard.getResident().getId(),
                    diaryCard.getWeekStartDate(),
                    diaryCard.getWeekEndDate()
            );
        }

        int currentBalance = diaryCard.getStartingPoints() + totalEarned - totalRedeemed;
        diaryCard.setCurrentBalance(currentBalance);

        PointsDiaryCard saved = diaryCardRepo.save(diaryCard);
        return toResponse(saved);
    }

    private int calculateTotalPointsFromJson(String dailyPointsJson) {
        if (dailyPointsJson == null || dailyPointsJson.isEmpty()) {
            return 0;
        }

        try {
            // Parse the diary points JSON
            // Format: { "s1_rule": {"0": 2, "1": "R1", ...}, "s1_directive": {...}, ... }
            var diaryPoints = JsonUtil.toMap(dailyPointsJson);
            int total = 0;
            
            for (var behaviorEntry : diaryPoints.entrySet()) {
                var dayValues = (java.util.Map<String, Object>) behaviorEntry.getValue();
                
                // Iterate through each day (0-6)
                for (var dayEntry : dayValues.entrySet()) {
                    Object value = dayEntry.getValue();
                    
                    if (value == null) {
                        continue;
                    }
                    
                    // If value is R, R1, R2, or R3, it counts as 0 points
                    String strValue = value.toString();
                    if (strValue.equals("R") || strValue.equals("R1") || 
                        strValue.equals("R2") || strValue.equals("R3")) {
                        continue; // 0 points
                    }
                    
                    // Otherwise, parse as integer and add
                    if (value instanceof Number) {
                        total += ((Number) value).intValue();
                    } else {
                        try {
                            total += Integer.parseInt(strValue);
                        } catch (NumberFormatException e) {
                            // Skip non-numeric values
                        }
                    }
                }
            }
            
            return total;
        } catch (Exception e) {
            System.err.println("Error calculating points from JSON: " + e.getMessage());
            return 0;
        }
    }

    private int calculateTotalRedemptionsFromJson(String dailyRedemptionsJson) {
        if (dailyRedemptionsJson == null || dailyRedemptionsJson.isEmpty()) {
            return 0;
        }

        try {
            // Parse: {"0": 10, "1": 5, ...}
            var redemptions = JsonUtil.toMap(dailyRedemptionsJson);
            int total = 0;
            
            for (var entry : redemptions.entrySet()) {
                Object value = entry.getValue();
                if (value instanceof Number) {
                    total += ((Number) value).intValue();
                } else {
                    try {
                        total += Integer.parseInt(value.toString());
                    } catch (NumberFormatException e) {
                        // Skip non-numeric values
                    }
                }
            }
            
            return total;
        } catch (Exception e) {
            System.err.println("Error calculating redemptions from JSON: " + e.getMessage());
            return 0;
        }
    }

    private PointsDiaryCardResponse toResponse(PointsDiaryCard card) {
        PointsDiaryCardResponse response = new PointsDiaryCardResponse();
        response.setId(card.getId());
        response.setProgramId(card.getProgram() != null ? card.getProgram().getId() : null);
        response.setResidentId(card.getResident() != null ? card.getResident().getId() : null);
        
        if (card.getResident() != null) {
            response.setResidentName(card.getResident().getFullName());
            response.setResidentNumber(card.getResident().getResidentId());
        }
        
        response.setWeekStartDate(card.getWeekStartDate());
        response.setWeekEndDate(card.getWeekEndDate());
        response.setStartingPoints(card.getStartingPoints());
        response.setDailyPointsJson(card.getDailyPointsJson());
        response.setDailyRedemptionsJson(card.getDailyRedemptionsJson());
        response.setTotalPointsEarned(card.getTotalPointsEarned());
        response.setCurrentBalance(card.getCurrentBalance());
        response.setStatus(card.getStatus());
        response.setCreatedAt(card.getCreatedAt());
        response.setUpdatedAt(card.getUpdatedAt());
        
        return response;
    }
}

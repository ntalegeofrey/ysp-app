package app.ysp.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "points_diary_cards")
public class PointsDiaryCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resident_id", nullable = false)
    private ProgramResident resident;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "week_end_date", nullable = false)
    private LocalDate weekEndDate;

    @Column(name = "starting_points")
    private Integer startingPoints = 0;

    @Column(name = "daily_points_json", columnDefinition = "TEXT")
    private String dailyPointsJson; // JSON with daily points by shift and repair status

    @Column(name = "total_points_earned")
    private Integer totalPointsEarned = 0;

    @Column(name = "current_balance")
    private Integer currentBalance = 0;

    @Column(name = "status")
    private String status = "active"; // active, completed, archived

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public ProgramResident getResident() { return resident; }
    public void setResident(ProgramResident resident) { this.resident = resident; }

    public LocalDate getWeekStartDate() { return weekStartDate; }
    public void setWeekStartDate(LocalDate weekStartDate) { this.weekStartDate = weekStartDate; }

    public LocalDate getWeekEndDate() { return weekEndDate; }
    public void setWeekEndDate(LocalDate weekEndDate) { this.weekEndDate = weekEndDate; }

    public Integer getStartingPoints() { return startingPoints; }
    public void setStartingPoints(Integer startingPoints) { this.startingPoints = startingPoints; }

    public String getDailyPointsJson() { return dailyPointsJson; }
    public void setDailyPointsJson(String dailyPointsJson) { this.dailyPointsJson = dailyPointsJson; }

    public Integer getTotalPointsEarned() { return totalPointsEarned; }
    public void setTotalPointsEarned(Integer totalPointsEarned) { this.totalPointsEarned = totalPointsEarned; }

    public Integer getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(Integer currentBalance) { this.currentBalance = currentBalance; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

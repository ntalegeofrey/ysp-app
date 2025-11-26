package app.ysp.dto;

import java.time.LocalDate;

public class PointsDiaryCardRequest {
    private Long residentId;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private Integer startingPoints;
    private String dailyPointsJson;
    private String dailyRedemptionsJson;

    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }

    public LocalDate getWeekStartDate() { return weekStartDate; }
    public void setWeekStartDate(LocalDate weekStartDate) { this.weekStartDate = weekStartDate; }

    public LocalDate getWeekEndDate() { return weekEndDate; }
    public void setWeekEndDate(LocalDate weekEndDate) { this.weekEndDate = weekEndDate; }

    public Integer getStartingPoints() { return startingPoints; }
    public void setStartingPoints(Integer startingPoints) { this.startingPoints = startingPoints; }

    public String getDailyPointsJson() { return dailyPointsJson; }
    public void setDailyPointsJson(String dailyPointsJson) { this.dailyPointsJson = dailyPointsJson; }

    public String getDailyRedemptionsJson() { return dailyRedemptionsJson; }
    public void setDailyRedemptionsJson(String dailyRedemptionsJson) { this.dailyRedemptionsJson = dailyRedemptionsJson; }
}

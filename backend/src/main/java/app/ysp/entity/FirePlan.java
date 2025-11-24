package app.ysp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fire_plans")
public class FirePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @Column(name = "generated_date", nullable = false)
    private LocalDate generatedDate;

    @Column(name = "shift")
    private String shift; // Day, Evening, Night

    @Column(name = "total_staff")
    private Integer totalStaff;

    @Column(name = "total_residents")
    private Integer totalResidents;

    @Column(name = "special_assignments")
    private Integer specialAssignments;

    @Column(name = "primary_route")
    private String primaryRoute;

    @Column(name = "secondary_route")
    private String secondaryRoute;

    @Column(name = "status")
    private String status; // Active, Archived

    @Column(name = "staff_assignments_json", columnDefinition = "TEXT")
    private String staffAssignmentsJson;

    @Column(name = "resident_status_json", columnDefinition = "TEXT")
    private String residentStatusJson;

    @Column(name = "route_config_json", columnDefinition = "TEXT")
    private String routeConfigJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public LocalDate getGeneratedDate() { return generatedDate; }
    public void setGeneratedDate(LocalDate generatedDate) { this.generatedDate = generatedDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public Integer getTotalStaff() { return totalStaff; }
    public void setTotalStaff(Integer totalStaff) { this.totalStaff = totalStaff; }

    public Integer getTotalResidents() { return totalResidents; }
    public void setTotalResidents(Integer totalResidents) { this.totalResidents = totalResidents; }

    public Integer getSpecialAssignments() { return specialAssignments; }
    public void setSpecialAssignments(Integer specialAssignments) { this.specialAssignments = specialAssignments; }

    public String getPrimaryRoute() { return primaryRoute; }
    public void setPrimaryRoute(String primaryRoute) { this.primaryRoute = primaryRoute; }

    public String getSecondaryRoute() { return secondaryRoute; }
    public void setSecondaryRoute(String secondaryRoute) { this.secondaryRoute = secondaryRoute; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStaffAssignmentsJson() { return staffAssignmentsJson; }
    public void setStaffAssignmentsJson(String staffAssignmentsJson) { this.staffAssignmentsJson = staffAssignmentsJson; }

    public String getResidentStatusJson() { return residentStatusJson; }
    public void setResidentStatusJson(String residentStatusJson) { this.residentStatusJson = residentStatusJson; }

    public String getRouteConfigJson() { return routeConfigJson; }
    public void setRouteConfigJson(String routeConfigJson) { this.routeConfigJson = routeConfigJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

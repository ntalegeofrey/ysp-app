package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "movement_staff_assignments")
public class MovementStaffAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movement_id", nullable = false)
    private OffsiteMovement movement;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private User staff;
    
    @Column(name = "assignment_role", nullable = false, length = 20)
    private String assignmentRole = "PRIMARY";
    
    @Column(name = "assigned_at", nullable = false)
    private Instant assignedAt = Instant.now();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by_staff_id", nullable = false)
    private User assignedByStaff;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public OffsiteMovement getMovement() {
        return movement;
    }
    
    public void setMovement(OffsiteMovement movement) {
        this.movement = movement;
    }
    
    public User getStaff() {
        return staff;
    }
    
    public void setStaff(User staff) {
        this.staff = staff;
    }
    
    public String getAssignmentRole() {
        return assignmentRole;
    }
    
    public void setAssignmentRole(String assignmentRole) {
        this.assignmentRole = assignmentRole;
    }
    
    public Instant getAssignedAt() {
        return assignedAt;
    }
    
    public void setAssignedAt(Instant assignedAt) {
        this.assignedAt = assignedAt;
    }
    
    public User getAssignedByStaff() {
        return assignedByStaff;
    }
    
    public void setAssignedByStaff(User assignedByStaff) {
        this.assignedByStaff = assignedByStaff;
    }
}

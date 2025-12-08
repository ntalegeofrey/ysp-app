package app.ysp.repository;

import app.ysp.entity.MovementStaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovementStaffAssignmentRepository extends JpaRepository<MovementStaffAssignment, Long> {
    
    // Find all assignments for a movement
    List<MovementStaffAssignment> findByMovement_Id(Long movementId);
    
    // Find all assignments for a staff member
    List<MovementStaffAssignment> findByStaff_Id(Long staffId);
    
    // Count assignments for a movement
    long countByMovement_Id(Long movementId);
    
    // Check if staff is already assigned to a movement
    boolean existsByMovement_IdAndStaff_Id(Long movementId, Long staffId);
    
    // Delete all assignments for a movement
    void deleteByMovement_Id(Long movementId);
    
    // Find staff assigned to a movement by role
    @Query("SELECT sa FROM MovementStaffAssignment sa " +
           "WHERE sa.movement.id = :movementId " +
           "AND sa.assignmentRole = :role")
    List<MovementStaffAssignment> findByMovementAndRole(
        @Param("movementId") Long movementId, 
        @Param("role") String role
    );
}

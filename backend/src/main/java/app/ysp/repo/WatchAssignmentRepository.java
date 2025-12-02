package app.ysp.repo;

import app.ysp.entity.WatchAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WatchAssignmentRepository extends JpaRepository<WatchAssignment, Long> {

    // Find all watches for a program
    @Query("SELECT w FROM WatchAssignment w WHERE w.program.id = :programId ORDER BY w.startDateTime DESC")
    List<WatchAssignment> findByProgramIdOrderByStartDateDesc(@Param("programId") Long programId);

    // Find active watches for a program
    @Query("SELECT w FROM WatchAssignment w WHERE w.program.id = :programId AND w.status = 'ACTIVE' ORDER BY w.startDateTime DESC")
    List<WatchAssignment> findActiveWatchesByProgramId(@Param("programId") Long programId);

    // Find watches by status for a program
    @Query("SELECT w FROM WatchAssignment w WHERE w.program.id = :programId AND w.status = :status ORDER BY w.startDateTime DESC")
    List<WatchAssignment> findByProgramIdAndStatus(@Param("programId") Long programId, @Param("status") String status);

    // Find watches by watch type for a program
    @Query("SELECT w FROM WatchAssignment w WHERE w.program.id = :programId AND w.watchType = :watchType ORDER BY w.startDateTime DESC")
    List<WatchAssignment> findByProgramIdAndWatchType(@Param("programId") Long programId, @Param("watchType") String watchType);

    // Find current active watch for a resident
    @Query("SELECT w FROM WatchAssignment w WHERE w.resident.id = :residentId AND w.status = 'ACTIVE'")
    Optional<WatchAssignment> findActiveWatchByResidentId(@Param("residentId") Long residentId);

    // Find all watches for a specific resident
    @Query("SELECT w FROM WatchAssignment w WHERE w.resident.id = :residentId ORDER BY w.startDateTime DESC")
    List<WatchAssignment> findByResidentIdOrderByStartDateDesc(@Param("residentId") Long residentId);

    // Count active watches by watch type for a program
    @Query("SELECT COUNT(w) FROM WatchAssignment w WHERE w.program.id = :programId AND w.status = 'ACTIVE' AND w.watchType = :watchType")
    long countActiveWatchesByProgramIdAndWatchType(@Param("programId") Long programId, @Param("watchType") String watchType);

    // Count all active watches for a program
    @Query("SELECT COUNT(w) FROM WatchAssignment w WHERE w.program.id = :programId AND w.status = 'ACTIVE'")
    long countActiveWatchesByProgramId(@Param("programId") Long programId);
}

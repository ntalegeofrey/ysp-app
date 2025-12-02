package app.ysp.repo;

import app.ysp.entity.WatchLogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface WatchLogEntryRepository extends JpaRepository<WatchLogEntry, Long> {

    // Find all log entries for a watch assignment
    @Query("SELECT e FROM WatchLogEntry e WHERE e.watchAssignment.id = :watchAssignmentId ORDER BY e.observationTime DESC")
    List<WatchLogEntry> findByWatchAssignmentIdOrderByTimeDesc(@Param("watchAssignmentId") Long watchAssignmentId);

    // Find recent log entries for a watch assignment (e.g., last 6 hours)
    @Query("SELECT e FROM WatchLogEntry e WHERE e.watchAssignment.id = :watchAssignmentId AND e.observationTime >= :since ORDER BY e.observationTime DESC")
    List<WatchLogEntry> findRecentEntriesByWatchAssignmentId(@Param("watchAssignmentId") Long watchAssignmentId, @Param("since") Instant since);

    // Find entries by observation status
    @Query("SELECT e FROM WatchLogEntry e WHERE e.watchAssignment.id = :watchAssignmentId AND e.observationStatus = :status ORDER BY e.observationTime DESC")
    List<WatchLogEntry> findByWatchAssignmentIdAndStatus(@Param("watchAssignmentId") Long watchAssignmentId, @Param("status") String status);

    // Count total entries for a watch assignment
    @Query("SELECT COUNT(e) FROM WatchLogEntry e WHERE e.watchAssignment.id = :watchAssignmentId")
    long countByWatchAssignmentId(@Param("watchAssignmentId") Long watchAssignmentId);

    // Find entries within a time range
    @Query("SELECT e FROM WatchLogEntry e WHERE e.watchAssignment.id = :watchAssignmentId AND e.observationTime BETWEEN :startTime AND :endTime ORDER BY e.observationTime DESC")
    List<WatchLogEntry> findByWatchAssignmentIdAndTimeRange(
        @Param("watchAssignmentId") Long watchAssignmentId, 
        @Param("startTime") Instant startTime, 
        @Param("endTime") Instant endTime
    );
}

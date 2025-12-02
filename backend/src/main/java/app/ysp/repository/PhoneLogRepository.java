package app.ysp.repository;

import app.ysp.entity.PhoneLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhoneLogRepository extends JpaRepository<PhoneLog, Long> {
    
    // Find all phone logs for a program, ordered by date descending
    Page<PhoneLog> findByProgram_IdOrderByCallDateTimeDesc(Long programId, Pageable pageable);
    
    // Find all phone logs for a specific resident
    List<PhoneLog> findByResident_IdOrderByCallDateTimeDesc(Long residentId);
    
    // Find all phone logs for a resident in a program
    List<PhoneLog> findByProgram_IdAndResident_IdOrderByCallDateTimeDesc(Long programId, Long residentId);
    
    // Find by program and call type
    List<PhoneLog> findByProgram_IdAndCallTypeOrderByCallDateTimeDesc(Long programId, String callType);
    
    // Find by program and contact relationship
    List<PhoneLog> findByProgram_IdAndContactRelationshipOrderByCallDateTimeDesc(Long programId, String contactRelationship);
    
    // Find today's phone logs
    @Query("SELECT p FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND DATE(p.callDateTime) = :date " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> findTodaysPhoneLogs(@Param("programId") Long programId, @Param("date") LocalDate date);
    
    // Find recent phone logs (last N days)
    @Query("SELECT p FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND p.callDateTime >= :startTime " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> findRecentPhoneLogs(@Param("programId") Long programId, @Param("startTime") Instant startTime);
    
    // Find phone logs by date range
    @Query("SELECT p FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND p.callDateTime BETWEEN :startTime AND :endTime " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> findByDateRange(
        @Param("programId") Long programId,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime
    );
    
    // Find logs with concerning behavior
    @Query("SELECT p FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND (p.behaviorDuringCall IN ('DISTRESSED', 'CONCERNING') " +
           "OR p.postCallBehavior IN ('SIGNIFICANTLY_IMPACTED', 'CRISIS_LEVEL')) " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> findLogsWithConcerningBehavior(@Param("programId") Long programId);
    
    // Find logs that were terminated early
    @Query("SELECT p FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND p.callTerminatedEarly = true " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> findTerminatedCalls(@Param("programId") Long programId);
    
    // Find emergency calls
    @Query("SELECT p FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND p.callType = 'EMERGENCY' " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> findEmergencyCalls(@Param("programId") Long programId);
    
    // Search phone logs
    @Query("SELECT p FROM PhoneLog p " +
           "JOIN p.resident r " +
           "WHERE p.program.id = :programId " +
           "AND (LOWER(r.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(r.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.contactName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.additionalComments) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY p.callDateTime DESC")
    List<PhoneLog> searchPhoneLogs(@Param("programId") Long programId, @Param("search") String search);
    
    // Complex filter query for archive
    @Query("SELECT p FROM PhoneLog p " +
           "JOIN p.resident r " +
           "WHERE p.program.id = :programId " +
           "AND (:residentId IS NULL OR p.resident.id = :residentId) " +
           "AND (:callType IS NULL OR p.callType = :callType) " +
           "AND (:contactRelationship IS NULL OR p.contactRelationship = :contactRelationship) " +
           "AND (:startTime IS NULL OR p.callDateTime >= :startTime) " +
           "AND (:endTime IS NULL OR p.callDateTime <= :endTime) " +
           "ORDER BY p.callDateTime DESC")
    Page<PhoneLog> filterPhoneLogs(
        @Param("programId") Long programId,
        @Param("residentId") Long residentId,
        @Param("callType") String callType,
        @Param("contactRelationship") String contactRelationship,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime,
        Pageable pageable
    );
    
    // Count phone logs for a program
    long countByProgram_Id(Long programId);
    
    // Count phone logs for a resident
    long countByResident_Id(Long residentId);
    
    // Count phone logs by call type
    long countByProgram_IdAndCallType(Long programId, String callType);
    
    // Count today's phone logs
    @Query("SELECT COUNT(p) FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND DATE(p.callDateTime) = :date")
    long countTodaysPhoneLogs(@Param("programId") Long programId, @Param("date") LocalDate date);
    
    // Count concerning behaviors in recent calls
    @Query("SELECT COUNT(p) FROM PhoneLog p WHERE p.program.id = :programId " +
           "AND p.callDateTime >= :startTime " +
           "AND (p.behaviorDuringCall IN ('DISTRESSED', 'CONCERNING') " +
           "OR p.postCallBehavior IN ('SIGNIFICANTLY_IMPACTED', 'CRISIS_LEVEL'))")
    long countRecentConcerningBehaviors(@Param("programId") Long programId, @Param("startTime") Instant startTime);
}

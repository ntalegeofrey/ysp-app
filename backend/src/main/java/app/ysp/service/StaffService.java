package app.ysp.service;

import app.ysp.domain.User;
import app.ysp.dto.StaffMemberResponse;
import app.ysp.entity.ProgramAssignment;
import app.ysp.repo.ProgramAssignmentRepository;
import app.ysp.repo.ProgramRepository;
import app.ysp.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StaffService {
    
    private final UserRepository userRepository;
    private final ProgramAssignmentRepository assignmentRepository;
    private final ProgramRepository programRepository;
    
    public StaffService(UserRepository userRepository, ProgramAssignmentRepository assignmentRepository, ProgramRepository programRepository) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.programRepository = programRepository;
    }
    
    /**
     * Get all staff members for a program with merged User + ProgramAssignment data
     */
    public List<StaffMemberResponse> getProgramStaff(Long programId) {
        List<ProgramAssignment> assignments = assignmentRepository.findByProgram_Id(programId);
        
        // Group by userId to deduplicate
        Map<Long, ProgramAssignment> assignmentByUserId = new HashMap<>();
        for (ProgramAssignment assignment : assignments) {
            if (assignment.getUserId() != null) {
                assignmentByUserId.putIfAbsent(assignment.getUserId(), assignment);
            }
        }
        
        List<StaffMemberResponse> result = new ArrayList<>();
        
        for (ProgramAssignment assignment : assignmentByUserId.values()) {
            Optional<User> userOpt = userRepository.findById(assignment.getUserId());
            if (userOpt.isEmpty()) continue;
            
            User user = userOpt.get();
            StaffMemberResponse staff = new StaffMemberResponse();
            
            // User data (authoritative source)
            staff.setUserId(user.getId());
            staff.setEmployeeNumber(user.getEmployeeNumber());
            staff.setEmail(user.getEmail());
            staff.setFullName(user.getFullName() != null ? user.getFullName() : 
                (user.getFirstName() + " " + user.getLastName()).trim());
            staff.setFirstName(user.getFirstName());
            staff.setLastName(user.getLastName());
            staff.setJobTitle(user.getJobTitle());
            staff.setSystemRole(user.getRole());
            staff.setIsEnabled(user.getEnabled());
            
            // Program assignment data
            staff.setProgramRole(assignment.getRoleType());
            staff.setCategory(assignment.getCategory());
            staff.setStatus(assignment.getStatus());
            
            // Format display name with abbreviated title
            String displayName = staff.getFullName();
            if (staff.getJobTitle() != null && !staff.getJobTitle().isEmpty()) {
                String abbrev = abbreviateTitle(staff.getJobTitle());
                staff.setJobTitleAbbrev(abbrev);
                displayName = staff.getFullName() + " (" + abbrev + ")";
            }
            staff.setDisplayName(displayName);
            
            result.add(staff);
        }
        
        // Sort by full name
        result.sort(Comparator.comparing(StaffMemberResponse::getFullName, 
            Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)));
        
        return result;
    }
    
    /**
     * Get staff member by user ID with merged data
     */
    public Optional<StaffMemberResponse> getStaffByUserId(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return Optional.empty();
        
        User user = userOpt.get();
        List<ProgramAssignment> assignments = assignmentRepository.findByUserId(userId);
        
        return Optional.of(buildStaffResponse(user, assignments.isEmpty() ? null : assignments.get(0)));
    }
    
    /**
     * Get staff member by employee number
     */
    public Optional<StaffMemberResponse> getStaffByEmployeeNumber(String employeeNumber) {
        Optional<User> userOpt = userRepository.findByEmployeeNumber(employeeNumber);
        if (userOpt.isEmpty()) return Optional.empty();
        
        User user = userOpt.get();
        List<ProgramAssignment> assignments = assignmentRepository.findByUserId(user.getId());
        
        return Optional.of(buildStaffResponse(user, assignments.isEmpty() ? null : assignments.get(0)));
    }
    
    /**
     * Get staff member by email
     */
    public Optional<StaffMemberResponse> getStaffByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isEmpty()) return Optional.empty();
        
        User user = userOpt.get();
        List<ProgramAssignment> assignments = assignmentRepository.findByUserId(user.getId());
        
        return Optional.of(buildStaffResponse(user, assignments.isEmpty() ? null : assignments.get(0)));
    }
    
    /**
     * Get all staff in a specific region
     * EFFICIENT: First finds all programs in region, then gets their staff assignments
     */
    public List<StaffMemberResponse> getRegionStaff(String regionName) {
        // Step 1: Get all program IDs in this region (single query)
        List<Long> programIds = programRepository.findProgramIdsByRegion(regionName);
        
        if (programIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Step 2: Get all assignments for these programs
        Map<Long, ProgramAssignment> assignmentByUserId = new HashMap<>();
        for (Long programId : programIds) {
            List<ProgramAssignment> assignments = assignmentRepository.findByProgram_Id(programId);
            for (ProgramAssignment assignment : assignments) {
                if (assignment.getUserId() != null) {
                    assignmentByUserId.putIfAbsent(assignment.getUserId(), assignment);
                }
            }
        }
        
        // Step 3: Build staff responses
        List<StaffMemberResponse> result = new ArrayList<>();
        for (ProgramAssignment assignment : assignmentByUserId.values()) {
            Optional<User> userOpt = userRepository.findById(assignment.getUserId());
            if (userOpt.isEmpty()) continue;
            
            User user = userOpt.get();
            result.add(buildStaffResponse(user, assignment));
        }
        
        result.sort(Comparator.comparing(StaffMemberResponse::getFullName, 
            Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)));
        
        return result;
    }
    
    /**
     * Get all staff in the system
     * Returns all users with optional program assignment data
     */
    public List<StaffMemberResponse> getAllStaff(Boolean activeOnly) {
        List<User> users = userRepository.findAll();
        
        // Build map of user assignments
        List<ProgramAssignment> allAssignments = assignmentRepository.findAll();
        Map<Long, ProgramAssignment> assignmentByUserId = new HashMap<>();
        for (ProgramAssignment assignment : allAssignments) {
            if (assignment.getUserId() != null) {
                assignmentByUserId.putIfAbsent(assignment.getUserId(), assignment);
            }
        }
        
        List<StaffMemberResponse> result = new ArrayList<>();
        for (User user : users) {
            // Filter by active status if requested
            if (activeOnly != null && activeOnly && !Boolean.TRUE.equals(user.getEnabled())) {
                continue;
            }
            
            ProgramAssignment assignment = assignmentByUserId.get(user.getId());
            result.add(buildStaffResponse(user, assignment));
        }
        
        result.sort(Comparator.comparing(StaffMemberResponse::getFullName, 
            Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)));
        
        return result;
    }
    
    private StaffMemberResponse buildStaffResponse(User user, ProgramAssignment assignment) {
        StaffMemberResponse staff = new StaffMemberResponse();
        
        // User data
        staff.setUserId(user.getId());
        staff.setEmployeeNumber(user.getEmployeeNumber());
        staff.setEmail(user.getEmail());
        staff.setFullName(user.getFullName() != null ? user.getFullName() : 
            (user.getFirstName() + " " + user.getLastName()).trim());
        staff.setFirstName(user.getFirstName());
        staff.setLastName(user.getLastName());
        staff.setJobTitle(user.getJobTitle());
        staff.setSystemRole(user.getRole());
        staff.setIsEnabled(user.getEnabled());
        
        // Program assignment data (if available)
        if (assignment != null) {
            staff.setProgramRole(assignment.getRoleType());
            staff.setCategory(assignment.getCategory());
            staff.setStatus(assignment.getStatus());
        }
        
        // Format display name
        String displayName = staff.getFullName();
        if (staff.getJobTitle() != null && !staff.getJobTitle().isEmpty()) {
            String abbrev = abbreviateTitle(staff.getJobTitle());
            staff.setJobTitleAbbrev(abbrev);
            displayName = staff.getFullName() + " (" + abbrev + ")";
        }
        staff.setDisplayName(displayName);
        
        return staff;
    }
    
    /**
     * Abbreviate job titles for display
     */
    private String abbreviateTitle(String title) {
        if (title == null) return "";
        
        Map<String, String> abbreviations = new HashMap<>();
        abbreviations.put("Juvenile Justice Youth Development Specialist I", "JJYDS-I");
        abbreviations.put("Juvenile Justice Youth Development Specialist II", "JJYDS-II");
        abbreviations.put("Juvenile Justice Youth Development Specialist III", "JJYDS-III");
        abbreviations.put("Master Juvenile Justice Youth Development Specialist", "M-JJYDS");
        abbreviations.put("Youth Services Group Worker", "YSGW");
        abbreviations.put("Program Director", "PD");
        abbreviations.put("Assistant Program Director", "APD");
        abbreviations.put("Caseworker I", "CW-I");
        abbreviations.put("Caseworker II", "CW-II");
        abbreviations.put("Clinical Social Worker I", "CSW-I");
        abbreviations.put("Clinical Social Worker II", "CSW-II");
        abbreviations.put("Psychologist", "PSY");
        abbreviations.put("Registered Nurse", "RN");
        abbreviations.put("Nurse Practitioner", "NP");
        abbreviations.put("Teacher", "TCH");
        abbreviations.put("Special Education Teacher", "SPED-T");
        abbreviations.put("Administrative Assistant", "AA");
        abbreviations.put("Medical Director", "MD");
        
        return abbreviations.getOrDefault(title, title);
    }
}

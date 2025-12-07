package app.ysp.dto;

public class StaffAssignmentResponse {
    private Long id;
    private Long userId;
    private String userEmail;
    private String roleType;
    private String employeeId;
    private String title;
    private String category;
    private String status;
    
    // User information
    private String firstName;
    private String lastName;
    private String fullName;
    
    public StaffAssignmentResponse() {}
    
    public StaffAssignmentResponse(Long id, Long userId, String userEmail, String roleType, 
                                   String employeeId, String title, String category, String status,
                                   String firstName, String lastName, String fullName) {
        this.id = id;
        this.userId = userId;
        this.userEmail = userEmail;
        this.roleType = roleType;
        this.employeeId = employeeId;
        this.title = title;
        this.category = category;
        this.status = status;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
    }
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getRoleType() { return roleType; }
    public void setRoleType(String roleType) { this.roleType = roleType; }
    
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}

package app.ysp.dto;

/**
 * Merged staff response combining User and ProgramAssignment data
 * Used by /api/programs/{id}/staff and other staff lookup endpoints
 */
public class StaffMemberResponse {
    private Long userId;
    private String employeeNumber;
    private String email;
    private String fullName;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private String jobTitleAbbrev;
    private String displayName;
    private String systemRole;
    private String programRole;
    private String category;
    private String status;
    private Boolean isEnabled;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobTitleAbbrev() {
        return jobTitleAbbrev;
    }

    public void setJobTitleAbbrev(String jobTitleAbbrev) {
        this.jobTitleAbbrev = jobTitleAbbrev;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getSystemRole() {
        return systemRole;
    }

    public void setSystemRole(String systemRole) {
        this.systemRole = systemRole;
    }

    public String getProgramRole() {
        return programRole;
    }

    public void setProgramRole(String programRole) {
        this.programRole = programRole;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsEnabled() {
        return isEnabled;
    }

    public void setIsEnabled(Boolean isEnabled) {
        this.isEnabled = isEnabled;
    }
}

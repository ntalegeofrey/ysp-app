package app.ysp.dto;

public class UpdateUserRequest {
    private String role; // optional
    private Boolean enabled; // optional
    private Boolean mustChangePassword; // optional
    private Boolean sendOneTimeLogin; // optional
    private String fullName; // optional
    private String jobTitle; // optional
    private String employeeNumber; // optional

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public Boolean getMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(Boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }
    public Boolean getSendOneTimeLogin() { return sendOneTimeLogin; }
    public void setSendOneTimeLogin(Boolean sendOneTimeLogin) { this.sendOneTimeLogin = sendOneTimeLogin; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }
}

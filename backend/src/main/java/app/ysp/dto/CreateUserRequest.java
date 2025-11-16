package app.ysp.dto;

public class CreateUserRequest {
    private String email;
    private String role; // admin or user
    private boolean sendOneTimeLogin;
    private String fullName;
    private String jobTitle;
    private String employeeNumber;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isSendOneTimeLogin() { return sendOneTimeLogin; }
    public void setSendOneTimeLogin(boolean sendOneTimeLogin) { this.sendOneTimeLogin = sendOneTimeLogin; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }
}

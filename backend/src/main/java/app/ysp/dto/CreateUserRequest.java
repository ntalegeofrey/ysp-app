package app.ysp.dto;

public class CreateUserRequest {
    private String email;
    private String role; // admin or user
    private boolean sendOneTimeLogin;
    // Either provide fullName, or provide name parts below
    private String fullName;
    private String firstName;
    private String middleName;
    private String lastName;
    private String jobTitle;
    private String jobTitleOther; // used when jobTitle == "Other"
    private String employeeNumber;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isSendOneTimeLogin() { return sendOneTimeLogin; }
    public void setSendOneTimeLogin(boolean sendOneTimeLogin) { this.sendOneTimeLogin = sendOneTimeLogin; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getJobTitleOther() { return jobTitleOther; }
    public void setJobTitleOther(String jobTitleOther) { this.jobTitleOther = jobTitleOther; }
    public String getEmployeeNumber() { return employeeNumber; }
    public void setEmployeeNumber(String employeeNumber) { this.employeeNumber = employeeNumber; }
}

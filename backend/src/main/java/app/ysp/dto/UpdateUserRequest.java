package app.ysp.dto;

public class UpdateUserRequest {
    private String role; // optional
    private Boolean enabled; // optional
    private Boolean mustChangePassword; // optional
    private Boolean sendOneTimeLogin; // optional

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public Boolean getMustChangePassword() { return mustChangePassword; }
    public void setMustChangePassword(Boolean mustChangePassword) { this.mustChangePassword = mustChangePassword; }
    public Boolean getSendOneTimeLogin() { return sendOneTimeLogin; }
    public void setSendOneTimeLogin(Boolean sendOneTimeLogin) { this.sendOneTimeLogin = sendOneTimeLogin; }
}

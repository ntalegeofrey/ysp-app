package app.ysp.dto;

public class CreateUserRequest {
    private String email;
    private String role; // admin or user
    private boolean sendOneTimeLogin;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isSendOneTimeLogin() { return sendOneTimeLogin; }
    public void setSendOneTimeLogin(boolean sendOneTimeLogin) { this.sendOneTimeLogin = sendOneTimeLogin; }
}

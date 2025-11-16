package app.ysp.dto;

public class TokenResponse {
    private boolean mfaRequired;
    private String accessToken;
    private boolean requiresPasswordUpdate;

    public TokenResponse() {}
    public TokenResponse(boolean mfaRequired) { this.mfaRequired = mfaRequired; }
    public TokenResponse(String accessToken) { this.mfaRequired = false; this.accessToken = accessToken; }

    public boolean isMfaRequired() { return mfaRequired; }
    public void setMfaRequired(boolean mfaRequired) { this.mfaRequired = mfaRequired; }
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public boolean isRequiresPasswordUpdate() { return requiresPasswordUpdate; }
    public void setRequiresPasswordUpdate(boolean requiresPasswordUpdate) { this.requiresPasswordUpdate = requiresPasswordUpdate; }
}

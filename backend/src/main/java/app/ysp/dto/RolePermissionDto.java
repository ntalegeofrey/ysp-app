package app.ysp.dto;

public class RolePermissionDto {
    private String module;
    private String access; // FULL, EDIT, VIEW, NONE

    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public String getAccess() { return access; }
    public void setAccess(String access) { this.access = access; }
}

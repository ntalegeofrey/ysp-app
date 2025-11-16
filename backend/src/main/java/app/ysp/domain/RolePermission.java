package app.ysp.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "role_permissions", uniqueConstraints = @UniqueConstraint(columnNames = {"role_id","module"}))
public class RolePermission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(nullable = false)
    private String module; // e.g. inventory, ucr, sleep_log, etc.

    @Column(nullable = false)
    private String access; // FULL, EDIT, VIEW, NONE

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public String getAccess() { return access; }
    public void setAccess(String access) { this.access = access; }
}

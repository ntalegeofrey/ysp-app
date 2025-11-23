package app.ysp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "staff_registry")
public class ProgramAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // staff_id in DB

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id")
    private Program program;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "role_type")
    private String roleType; // REGIONAL_ADMIN, PROGRAM_DIRECTOR, ASSISTANT_DIRECTOR, STAFF

    // New staff registry fields
    @Column(name = "employee_id")
    private String employeeId; // 6-digit state employee identifier

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "start_date")
    private java.time.LocalDate startDate;

    @Column(name = "title")
    private String title; // staff title/position

    @Column(name = "gender")
    private String gender;

    @Column(name = "status")
    private String status; // active / not_active

    @Column(name = "category")
    private String category; // e.g. Direct Care, Clinical, Administration, Medical, Education, Transportation etc

    @Column(name = "notes")
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getRoleType() { return roleType; }
    public void setRoleType(String roleType) { this.roleType = roleType; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public java.time.LocalDate getStartDate() { return startDate; }
    public void setStartDate(java.time.LocalDate startDate) { this.startDate = startDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

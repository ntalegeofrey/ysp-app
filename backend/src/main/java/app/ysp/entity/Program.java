package app.ysp.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "programs")
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "program_type")
    private String programType;

    @Column(name = "program_type_other")
    private String programTypeOther;

    private Integer capacity;

    private String status; // active, planning, construction, maintenance, inactive

    @Column(length = 4000)
    private String description;

    // Location
    private String street;
    private String city;
    private String state;
    private String zip;
    private String county;

    // Operations
    @Column(name = "operating_hours")
    private String operatingHours;
    @Column(name = "custom_schedule")
    private String customSchedule;
    @Column(name = "security_level")
    private String securityLevel;
    @Column(name = "target_population")
    private String targetPopulation;
    @Column(name = "expected_opening_date")
    private LocalDate expectedOpeningDate;

    @Column(name = "gender")
    private String gender; // mixed, boys, girls

    // Region and Directors
    private String region;
    
    @Column(name = "regional_admin_first_name")
    private String regionalAdminFirstName;
    @Column(name = "regional_admin_last_name")
    private String regionalAdminLastName;
    @Column(name = "regional_admin_email")
    private String regionalAdminEmail;
    
    @Column(name = "program_director_first_name")
    private String programDirectorFirstName;
    @Column(name = "program_director_last_name")
    private String programDirectorLastName;
    @Column(name = "program_director_email")
    private String programDirectorEmail;
    
    @Column(name = "assistant_director_first_name")
    private String assistantDirectorFirstName;
    @Column(name = "assistant_director_last_name")
    private String assistantDirectorLastName;
    @Column(name = "assistant_director_email")
    private String assistantDirectorEmail;

    private Boolean active = Boolean.TRUE;

    private OffsetDateTime createdAt = OffsetDateTime.now();
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProgramType() { return programType; }
    public void setProgramType(String programType) { this.programType = programType; }

    public String getProgramTypeOther() { return programTypeOther; }
    public void setProgramTypeOther(String programTypeOther) { this.programTypeOther = programTypeOther; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }

    public String getCounty() { return county; }
    public void setCounty(String county) { this.county = county; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public String getCustomSchedule() { return customSchedule; }
    public void setCustomSchedule(String customSchedule) { this.customSchedule = customSchedule; }

    public String getSecurityLevel() { return securityLevel; }
    public void setSecurityLevel(String securityLevel) { this.securityLevel = securityLevel; }

    public String getTargetPopulation() { return targetPopulation; }
    public void setTargetPopulation(String targetPopulation) { this.targetPopulation = targetPopulation; }

    public LocalDate getExpectedOpeningDate() { return expectedOpeningDate; }
    public void setExpectedOpeningDate(LocalDate expectedOpeningDate) { this.expectedOpeningDate = expectedOpeningDate; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getRegionalAdminFirstName() { return regionalAdminFirstName; }
    public void setRegionalAdminFirstName(String regionalAdminFirstName) { this.regionalAdminFirstName = regionalAdminFirstName; }

    public String getRegionalAdminLastName() { return regionalAdminLastName; }
    public void setRegionalAdminLastName(String regionalAdminLastName) { this.regionalAdminLastName = regionalAdminLastName; }

    public String getRegionalAdminEmail() { return regionalAdminEmail; }
    public void setRegionalAdminEmail(String regionalAdminEmail) { this.regionalAdminEmail = regionalAdminEmail; }

    public String getProgramDirectorFirstName() { return programDirectorFirstName; }
    public void setProgramDirectorFirstName(String programDirectorFirstName) { this.programDirectorFirstName = programDirectorFirstName; }

    public String getProgramDirectorLastName() { return programDirectorLastName; }
    public void setProgramDirectorLastName(String programDirectorLastName) { this.programDirectorLastName = programDirectorLastName; }

    public String getProgramDirectorEmail() { return programDirectorEmail; }
    public void setProgramDirectorEmail(String programDirectorEmail) { this.programDirectorEmail = programDirectorEmail; }

    public String getAssistantDirectorFirstName() { return assistantDirectorFirstName; }
    public void setAssistantDirectorFirstName(String assistantDirectorFirstName) { this.assistantDirectorFirstName = assistantDirectorFirstName; }

    public String getAssistantDirectorLastName() { return assistantDirectorLastName; }
    public void setAssistantDirectorLastName(String assistantDirectorLastName) { this.assistantDirectorLastName = assistantDirectorLastName; }

    public String getAssistantDirectorEmail() { return assistantDirectorEmail; }
    public void setAssistantDirectorEmail(String assistantDirectorEmail) { this.assistantDirectorEmail = assistantDirectorEmail; }
}

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
    @Column(name = "security_level")
    private String securityLevel;
    @Column(name = "target_population")
    private String targetPopulation;
    @Column(name = "expected_opening_date")
    private LocalDate expectedOpeningDate;

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

    public String getSecurityLevel() { return securityLevel; }
    public void setSecurityLevel(String securityLevel) { this.securityLevel = securityLevel; }

    public String getTargetPopulation() { return targetPopulation; }
    public void setTargetPopulation(String targetPopulation) { this.targetPopulation = targetPopulation; }

    public LocalDate getExpectedOpeningDate() { return expectedOpeningDate; }
    public void setExpectedOpeningDate(LocalDate expectedOpeningDate) { this.expectedOpeningDate = expectedOpeningDate; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

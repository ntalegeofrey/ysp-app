package app.ysp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "regions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String name;

    @Column(name = "address_line", nullable = false, length = 255)
    private String addressLine;

    @Column(nullable = false, length = 128)
    private String county;

    @Column(nullable = false, length = 32)
    private String state;

    @Column(nullable = false, length = 64)
    private String phone;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "regional_director_first_name", length = 128)
    private String regionalDirectorFirstName;

    @Column(name = "regional_director_last_name", length = 128)
    private String regionalDirectorLastName;

    @Column(name = "regional_director_email", length = 255)
    private String regionalDirectorEmail;

    private OffsetDateTime createdAt = OffsetDateTime.now();
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }

    public String getCounty() { return county; }
    public void setCounty(String county) { this.county = county; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRegionalDirectorFirstName() { return regionalDirectorFirstName; }
    public void setRegionalDirectorFirstName(String regionalDirectorFirstName) { this.regionalDirectorFirstName = regionalDirectorFirstName; }

    public String getRegionalDirectorLastName() { return regionalDirectorLastName; }
    public void setRegionalDirectorLastName(String regionalDirectorLastName) { this.regionalDirectorLastName = regionalDirectorLastName; }

    public String getRegionalDirectorEmail() { return regionalDirectorEmail; }
    public void setRegionalDirectorEmail(String regionalDirectorEmail) { this.regionalDirectorEmail = regionalDirectorEmail; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}

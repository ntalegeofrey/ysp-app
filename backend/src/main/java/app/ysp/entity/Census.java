package app.ysp.entity;

import app.ysp.domain.User;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "census")
public class Census {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "program_id")
    private Program program;

    @Column(name = "census_date", nullable = false)
    private LocalDate censusDate;

    @Column(name = "shift", nullable = false)
    private String shift; // MORNING, AFTERNOON, EVENING

    @ManyToOne
    @JoinColumn(name = "conducted_by")
    private User conductedBy;

    @Column(name = "conductor_name")
    private String conductorName; // Denormalized for display

    @Column(name = "total_residents")
    private Integer totalResidents;

    @Column(name = "dys_count")
    private Integer dysCount;

    @Column(name = "non_dys_count")
    private Integer nonDysCount;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "saved", nullable = false)
    private Boolean saved = false;

    @OneToMany(mappedBy = "census", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CensusEntry> entries = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public LocalDate getCensusDate() { return censusDate; }
    public void setCensusDate(LocalDate censusDate) { this.censusDate = censusDate; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public User getConductedBy() { return conductedBy; }
    public void setConductedBy(User conductedBy) { this.conductedBy = conductedBy; }

    public String getConductorName() { return conductorName; }
    public void setConductorName(String conductorName) { this.conductorName = conductorName; }

    public Integer getTotalResidents() { return totalResidents; }
    public void setTotalResidents(Integer totalResidents) { this.totalResidents = totalResidents; }

    public Integer getDysCount() { return dysCount; }
    public void setDysCount(Integer dysCount) { this.dysCount = dysCount; }

    public Integer getNonDysCount() { return nonDysCount; }
    public void setNonDysCount(Integer nonDysCount) { this.nonDysCount = nonDysCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Boolean getSaved() { return saved; }
    public void setSaved(Boolean saved) { this.saved = saved; }

    public List<CensusEntry> getEntries() { return entries; }
    public void setEntries(List<CensusEntry> entries) { this.entries = entries; }
}

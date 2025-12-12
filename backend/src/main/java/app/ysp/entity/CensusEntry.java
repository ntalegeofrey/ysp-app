package app.ysp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "census_entry")
public class CensusEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "census_id")
    private Census census;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resident_id")
    private ProgramResident resident;

    @Column(name = "resident_name")
    private String residentName; // Denormalized for display

    @Column(name = "status", nullable = false)
    private String status; // DYS or NON_DYS

    @Column(name = "comments")
    @Lob
    private String comments;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Census getCensus() { return census; }
    public void setCensus(Census census) { this.census = census; }

    public ProgramResident getResident() { return resident; }
    public void setResident(ProgramResident resident) { this.resident = resident; }

    public String getResidentName() { return residentName; }
    public void setResidentName(String residentName) { this.residentName = residentName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}

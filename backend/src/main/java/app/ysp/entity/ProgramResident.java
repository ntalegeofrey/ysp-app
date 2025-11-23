package app.ysp.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
@Table(name = "program_residents")
public class ProgramResident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "program_id")
    private Program program;

    @Column(name = "resident_id")
    private String residentId; // business id if any

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "room")
    private String room;

    @Column(name = "status")
    private String status;

    @Column(name = "advocate")
    private String advocate;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "temporary_location")
    private String temporaryLocation;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }

    public String getResidentId() { return residentId; }
    public void setResidentId(String residentId) { this.residentId = residentId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdvocate() { return advocate; }
    public void setAdvocate(String advocate) { this.advocate = advocate; }

    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate admissionDate) { this.admissionDate = admissionDate; }

    public String getTemporaryLocation() { return temporaryLocation; }
    public void setTemporaryLocation(String temporaryLocation) { this.temporaryLocation = temporaryLocation; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getFullName() { return ((lastName!=null?lastName:"") + ", " + (firstName!=null?firstName:" ")).trim(); }
}

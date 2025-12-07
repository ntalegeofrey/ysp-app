package app.ysp.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "resident_documents")
public class ResidentDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "resident_id", nullable = false)
    private Long residentId;
    
    @Column(name = "program_id", nullable = false)
    private Long programId;
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;
    
    @Column(name = "file_type")
    private String fileType;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "document_type")
    private String documentType; // e.g., "Legal", "Medical", "Clinical", "Administrative"
    
    @Column(name = "uploaded_by")
    private String uploadedBy;
    
    @Column(name = "uploaded_at", nullable = false)
    private Instant uploadedAt;
    
    @Column(name = "description", length = 500)
    private String description;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getResidentId() { return residentId; }
    public void setResidentId(Long residentId) { this.residentId = residentId; }
    
    public Long getProgramId() { return programId; }
    public void setProgramId(Long programId) { this.programId = programId; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }
    
    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }
    
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

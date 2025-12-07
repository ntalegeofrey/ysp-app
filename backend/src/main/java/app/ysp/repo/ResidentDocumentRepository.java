package app.ysp.repo;

import app.ysp.entity.ResidentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResidentDocumentRepository extends JpaRepository<ResidentDocument, Long> {
    
    List<ResidentDocument> findByResidentIdAndProgramIdOrderByUploadedAtDesc(Long residentId, Long programId);
    
    List<ResidentDocument> findByResidentIdOrderByUploadedAtDesc(Long residentId);
}

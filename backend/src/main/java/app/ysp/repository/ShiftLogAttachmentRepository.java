package app.ysp.repository;

import app.ysp.entity.ShiftLogAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftLogAttachmentRepository extends JpaRepository<ShiftLogAttachment, Long> {
    
    // Find all attachments for a shift log
    List<ShiftLogAttachment> findByShiftLog_Id(Long shiftLogId);
    
    // Delete all attachments for a shift log
    void deleteByShiftLog_Id(Long shiftLogId);
    
    // Count attachments for a shift log
    long countByShiftLog_Id(Long shiftLogId);
}

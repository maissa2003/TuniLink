package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.stage.backend.Classes.Document;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByEmployeeId(Long employeeId);
    List<Document> findByEmployeeIdOrderByUploadedAtDesc(Long employeeId);
    List<Document> findByEmployeeIdAndType(Long employeeId, Document.DocumentType type);
}

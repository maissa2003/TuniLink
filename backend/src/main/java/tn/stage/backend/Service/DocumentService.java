package tn.stage.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.stage.backend.Classes.Document;
import tn.stage.backend.Classes.Employee;
import tn.stage.backend.Repositories.DocumentRepository;
import tn.stage.backend.Repositories.EmployeeRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/documents/";

    public Document uploadDocument(Long employeeId, MultipartFile file, Document.DocumentType type) throws IOException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        String filePath = UPLOAD_DIR + uniqueFilename;

        // Save file
        Path path = Paths.get(filePath);
        Files.copy(file.getInputStream(), path);

        // Create document record
        Document document = new Document();
        document.setType(type);
        document.setFileName(originalFilename);
        document.setFilePath(filePath);
        document.setFileSize(file.getSize());
        document.setContentType(file.getContentType());
        document.setEmployee(employee);

        return documentRepository.save(document);
    }

    public byte[] downloadDocument(Long documentId) throws IOException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Path path = Paths.get(document.getFilePath());
        return Files.readAllBytes(path);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Document> getEmployeeDocuments(Long employeeId) {
        return documentRepository.findByEmployeeIdOrderByUploadedAtDesc(employeeId);
    }

    public Document getDocumentByType(Long employeeId, Document.DocumentType type) {
        List<Document> documents = documentRepository.findByEmployeeIdAndType(employeeId, type);
        return documents.isEmpty() ? null : documents.get(0);
    }

    public Document getDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public void deleteDocument(Long documentId) throws IOException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Delete file from filesystem
        Path path = Paths.get(document.getFilePath());
        if (Files.exists(path)) {
            Files.delete(path);
        }

        // Delete from database
        documentRepository.delete(document);
    }
}

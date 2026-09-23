package tn.stage.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.stage.backend.Classes.Document;
import tn.stage.backend.Service.DocumentService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam Long employeeId,
            @RequestParam("file") MultipartFile file,
            @RequestParam Document.DocumentType type) throws IOException {
        
        Document document = documentService.uploadDocument(employeeId, file, type);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/download/{documentId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId) throws IOException {
        byte[] fileContent = documentService.downloadDocument(documentId);
        Document document = documentService.getDocumentById(documentId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(document.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                .body(fileContent);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getAllDocuments() {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<List<Document>> getEmployeeDocuments(@PathVariable Long employeeId) {
        List<Document> documents = documentService.getEmployeeDocuments(employeeId);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/employee/{employeeId}/type/{type}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<Document> getDocumentByType(
            @PathVariable Long employeeId,
            @PathVariable Document.DocumentType type) {
        
        Document document = documentService.getDocumentByType(employeeId, type);
        return ResponseEntity.ok(document);
    }

    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId) throws IOException {
        documentService.deleteDocument(documentId);
        return ResponseEntity.ok().build();
    }
}

package tn.stage.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.stage.backend.Classes.Employee;
import tn.stage.backend.Classes.LeaveRequest;
import tn.stage.backend.Repositories.EmployeeRepository;
import tn.stage.backend.Repositories.LeaveRequestRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LeaveRequestService {


    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    private final String PROOF_DIR = System.getProperty("user.dir") + "/uploads/proofs/";

    public LeaveRequest createLeaveRequest(Long employeeId, LeaveRequest.LeaveType type, LocalDate startDate, LocalDate endDate, MultipartFile proof, String comments) throws IOException {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setType(type);
        leaveRequest.setStartDate(startDate);
        leaveRequest.setEndDate(endDate);
        leaveRequest.setEmployee(employee);
        leaveRequest.setComments(comments);
        
        // Handle proof document if provided
        if (proof != null && !proof.isEmpty()) {
            Path uploadPath = Paths.get(PROOF_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String originalFilename = proof.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            String filePath = PROOF_DIR + uniqueFilename;
            Files.copy(proof.getInputStream(), Paths.get(filePath));
            leaveRequest.setProofDocumentPath(filePath);
        }
        
        // Calculate days
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        leaveRequest.setDays((int) days);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);


        // TODO: Send notification to HR - EmailService needs sendEmail method
        // sendHrNotification(saved, employee);

        return saved;
    }

    public List<LeaveRequest> getEmployeeLeaveRequests(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest updateLeaveRequestStatus(Long requestId, LeaveRequest.LeaveStatus status) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        
        leaveRequest.setStatus(status);
        return leaveRequestRepository.save(leaveRequest);
    }

    public byte[] downloadProof(Long requestId) throws IOException {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        if (request.getProofDocumentPath() == null) {
            throw new RuntimeException("No proof attached");
        }
        Path path = Paths.get(request.getProofDocumentPath());
        return Files.readAllBytes(path);
    }
}

package tn.stage.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.Classes.LeaveRequest;
import tn.stage.backend.Service.LeaveRequestService;

import java.time.LocalDate;
import java.util.List;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController

@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "*")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveRequest> createLeaveRequest(
            @RequestParam Long employeeId,
            @RequestParam LeaveRequest.LeaveType type,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(required = false) MultipartFile proof,
            @RequestParam(required = false) String comments) throws IOException {
        
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        
        LeaveRequest leaveRequest = leaveRequestService.createLeaveRequest(employeeId, type, start, end, proof, comments);
        return ResponseEntity.ok(leaveRequest);
    }


    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getEmployeeLeaveRequests(@PathVariable Long employeeId) {
        List<LeaveRequest> requests = leaveRequestService.getEmployeeLeaveRequests(employeeId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        List<LeaveRequest> requests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{requestId}/status")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<LeaveRequest> updateLeaveRequestStatus(
            @PathVariable Long requestId,
            @RequestParam LeaveRequest.LeaveStatus status) {
        
        LeaveRequest updated = leaveRequestService.updateLeaveRequestStatus(requestId, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/download-proof/{requestId}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<byte[]> downloadProof(@PathVariable Long requestId) throws IOException {
        byte[] fileContent = leaveRequestService.downloadProof(requestId);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"proof-" + requestId + "\"")
                .body(fileContent);
    }
}

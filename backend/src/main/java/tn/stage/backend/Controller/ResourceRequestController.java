package tn.stage.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.DTO.CreateResourceRequestDto;
import tn.stage.backend.DTO.ResourceRequestDto;
import tn.stage.backend.DTO.UpdateResourceRequestStatusDto;
import tn.stage.backend.DTO.SimulationResultDto;
import tn.stage.backend.Service.ResourceRequestService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resource-requests")
public class ResourceRequestController {

    private final ResourceRequestService resourceRequestService;

    public ResourceRequestController(ResourceRequestService resourceRequestService) {
        this.resourceRequestService = resourceRequestService;
    }

    @GetMapping
    public ResponseEntity<List<ResourceRequestDto>> getAllRequests() {
        return ResponseEntity.ok(resourceRequestService.getAllRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ResourceRequestDto>> getMyRequests(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(resourceRequestService.getRequestsByClient(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody CreateResourceRequestDto dto, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        try {
            ResourceRequestDto created = resourceRequestService.createRequest(authentication.getName(), dto);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody UpdateResourceRequestStatusDto dto) {
        try {
            ResourceRequestDto updated = resourceRequestService.updateRequestStatus(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/save-simulation")
    public ResponseEntity<?> saveSimulation(@PathVariable Long id, @RequestBody SimulationResultDto resultDto) {
        try {
            return ResponseEntity.ok(resourceRequestService.saveSimulationDetails(id, resultDto));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveSimulation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resourceRequestService.approveSimulation(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectSimulation(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        try {
            String reason = payload != null ? payload.get("reason") : null;
            return ResponseEntity.ok(resourceRequestService.rejectSimulation(id, reason));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

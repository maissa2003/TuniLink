package tn.stage.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.DTO.CreateInfrastructureCostDto;
import tn.stage.backend.DTO.InfrastructureCostDto;
import tn.stage.backend.Service.InfrastructureService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/infrastructure")
@RequiredArgsConstructor
public class InfrastructureController {

    private final InfrastructureService infraService;

    /** GET /api/infrastructure/employee/{employeeId} — all cost entries */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<InfrastructureCostDto>> getCosts(@PathVariable Long employeeId) {
        return ResponseEntity.ok(infraService.getCostsByEmployee(employeeId));
    }

    /** GET /api/infrastructure/employee/{employeeId}/total — current month total */
    @GetMapping("/employee/{employeeId}/total")
    public ResponseEntity<Map<String, BigDecimal>> getTotal(@PathVariable Long employeeId) {
        BigDecimal total = infraService.getTotalMonthlyCost(employeeId);
        return ResponseEntity.ok(Map.of("total", total));
    }

    /** POST /api/infrastructure/employee/{employeeId} — add cost entry (INFRA dept) */
    @PostMapping("/employee/{employeeId}")
    public ResponseEntity<?> addCost(@PathVariable Long employeeId,
                                     @RequestBody CreateInfrastructureCostDto dto,
                                     Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            return ResponseEntity.ok(infraService.addCost(employeeId, dto, auth.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** PUT /api/infrastructure/{costId} — update a cost entry */
    @PutMapping("/{costId}")
    public ResponseEntity<?> updateCost(@PathVariable Long costId,
                                        @RequestBody CreateInfrastructureCostDto dto,
                                        Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            return ResponseEntity.ok(infraService.updateCost(costId, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** DELETE /api/infrastructure/{costId} — remove a cost entry */
    @DeleteMapping("/{costId}")
    public ResponseEntity<?> deleteCost(@PathVariable Long costId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        infraService.deleteCost(costId);
        return ResponseEntity.ok(Map.of("message", "Deleted"));
    }

    /**
     * POST /api/infrastructure/employee/{employeeId}/complete-assignment
     * Infrastructure dept signals all resources are assigned. Formally hands off to Finance.
     */
    @PostMapping("/employee/{employeeId}/complete-assignment")
    public ResponseEntity<?> completeAssignment(@PathVariable Long employeeId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            infraService.completeAssignment(employeeId, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Infrastructure assignment completed. Finance has been notified."));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}


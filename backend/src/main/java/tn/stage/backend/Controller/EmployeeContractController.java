package tn.stage.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.DTO.CreateContractDto;
import tn.stage.backend.DTO.EmployeeContractDto;
import tn.stage.backend.Service.EmployeeContractService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class EmployeeContractController {

    private final EmployeeContractService contractService;

    /** GET /api/contracts/employee/{employeeId} — all contracts for employee */
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeContractDto>> getContracts(@PathVariable Long employeeId) {
        return ResponseEntity.ok(contractService.getContractsByEmployee(employeeId));
    }

    /** GET /api/contracts/employee/{employeeId}/active — active contract only */
    @GetMapping("/employee/{employeeId}/active")
    public ResponseEntity<?> getActiveContract(@PathVariable Long employeeId) {
        try {
            return ResponseEntity.ok(contractService.getActiveContract(employeeId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** POST /api/contracts/employee/{employeeId} — HR creates a contract */
    @PostMapping("/employee/{employeeId}")
    public ResponseEntity<?> createContract(@PathVariable Long employeeId,
                                            @RequestBody CreateContractDto dto,
                                            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            EmployeeContractDto result = contractService.createContract(employeeId, dto, auth.getName());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** PUT /api/contracts/{contractId} — HR updates a contract */
    @PutMapping("/{contractId}")
    public ResponseEntity<?> updateContract(@PathVariable Long contractId,
                                            @RequestBody CreateContractDto dto,
                                            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            return ResponseEntity.ok(contractService.updateContract(contractId, dto, auth.getName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

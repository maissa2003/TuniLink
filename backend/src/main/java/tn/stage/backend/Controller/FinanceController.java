package tn.stage.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.DTO.InvoiceDto;
import tn.stage.backend.DTO.PayrollRecordDto;
import tn.stage.backend.Service.FinanceService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    /** GET /api/finance/payroll/{employeeId} — preview calculation (not saved) */
    @GetMapping("/payroll/{employeeId}")
    public ResponseEntity<?> getPayrollPreview(@PathVariable Long employeeId) {
        try {
            return ResponseEntity.ok(financeService.calculatePayrollPreview(employeeId));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** POST /api/finance/payroll/{employeeId}/validate — save & validate payroll */
    @PostMapping("/payroll/{employeeId}/validate")
    public ResponseEntity<?> validatePayroll(@PathVariable Long employeeId, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            PayrollRecordDto result = financeService.validatePayroll(employeeId, auth.getName());
            return ResponseEntity.ok(result);
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** POST /api/finance/payroll/{employeeId}/reject — reject payroll */
    @PostMapping("/payroll/{employeeId}/reject")
    public ResponseEntity<?> rejectPayroll(@PathVariable Long employeeId, @RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            financeService.rejectPayroll(employeeId, body.getOrDefault("reason", "No reason provided"), auth.getName());
            return ResponseEntity.ok(Map.of("message", "Payroll rejected successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** GET /api/finance/payroll/{employeeId}/history — all payroll records for employee */
    @GetMapping("/payroll/{employeeId}/history")
    public ResponseEntity<List<PayrollRecordDto>> getPayrollHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(financeService.getPayrollHistory(employeeId));
    }

    /** GET /api/finance/budget/{employeeId} — get budget for employee based on latest payroll */
    @GetMapping("/budget/{employeeId}")
    public ResponseEntity<?> getBudget(@PathVariable Long employeeId) {
        try {
            PayrollRecordDto preview = financeService.calculatePayrollPreview(employeeId);
            return ResponseEntity.ok(Map.of(
                "monthlyBudgetTnd", preview.getMonthlyBudgetTnd(),
                "annualBudgetTnd", preview.getAnnualBudgetTnd(),
                "yearProjections", preview.getYearProjections()
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** GET /api/finance/invoices — all invoices */
    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceDto>> getAllInvoices() {
        return ResponseEntity.ok(financeService.getAllInvoices());
    }

    /** GET /api/finance/invoices/assignment/{assignmentId} — invoices for one assignment */
    @GetMapping("/invoices/assignment/{assignmentId}")
    public ResponseEntity<List<InvoiceDto>> getInvoicesByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(financeService.getInvoicesByAssignment(assignmentId));
    }

    /** GET /api/finance/invoices/employee/{employeeId} — invoices for one employee */
    @GetMapping("/invoices/employee/{employeeId}")
    public ResponseEntity<List<InvoiceDto>> getInvoicesByEmployee(@PathVariable Long employeeId) {
        return ResponseEntity.ok(financeService.getInvoicesByEmployee(employeeId));
    }
}

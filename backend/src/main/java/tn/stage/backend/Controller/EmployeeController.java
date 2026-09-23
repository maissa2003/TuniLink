package tn.stage.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.Classes.*;
import tn.stage.backend.DTO.EmployeeDto;
import tn.stage.backend.Repositories.AssignmentRepository;
import tn.stage.backend.Repositories.EmployeeContractRepository;
import tn.stage.backend.Repositories.EmployeeRepository;
import tn.stage.backend.Repositories.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository employeeRepo;
    private final UserRepository userRepo;
    private final AssignmentRepository assignmentRepo;
    private final EmployeeContractRepository contractRepo;

    /** GET /api/employees — all employees (Admin, HR, Manager, Finance, Infrastructure) */
    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> result = employeeRepo.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    /** POST /api/employees — onboard a new employee */
    @PostMapping
    public ResponseEntity<?> onboardEmployee(@RequestBody Map<String, String> body, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        User user = userRepo.findByEmail(auth.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));

        Employee emp = new Employee();
        emp.setFullName(body.get("fullName"));
        emp.setDepartment(body.get("department") != null ? body.get("department") : "Engineering");
        emp.setNationality(body.getOrDefault("nationality", "Tunisian"));
        emp.setEmployeeNumber("EMP-" + System.currentTimeMillis());
        emp.setStatus(EmployeeStatus.RECRUITED);
        emp.setCompany(user.getCompany());

        String email = body.get("email");
        if (email != null && !email.trim().isEmpty()) {
            if (userRepo.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
            }
            User empUser = new User();
            empUser.setEmail(email);
            empUser.setUsername(email.split("@")[0] + "_" + (System.currentTimeMillis() % 1000));
            empUser.setPassword("$2a$10$8.UnVuG9HHgffUDAlk8GPuV5cOqVSYp71f.S4WcZ.z3Z.x7vP.Kqi"); // Default password
            empUser.setRole(Role.EMPLOYEE);
            empUser.setStatus("ACTIVE");
            empUser.setCompany(user.getCompany());
            userRepo.save(empUser);
            emp.setUser(empUser);
        }

        Employee saved = employeeRepo.save(emp);
        return ResponseEntity.ok(mapToDto(saved));
    }

    /** GET /api/employees/{id} — single employee with full context */
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployee(@PathVariable Long id) {
        return employeeRepo.findById(id)
                .map(e -> ResponseEntity.ok(mapToDto(e)))
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/employees/my — employee sees their own record */
    @GetMapping("/my")
    public ResponseEntity<?> getMyEmployee(Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        return userRepo.findByEmail(auth.getName())
                .flatMap(user -> employeeRepo.findAll().stream()
                        .filter(e -> e.getUser() != null && e.getUser().getId().equals(user.getId()))
                        .findFirst())
                .map(e -> ResponseEntity.ok(mapToDto(e)))
                .map(r -> (ResponseEntity<?>) r)
                .orElse(ResponseEntity.notFound().build());
    }

    /** PUT /api/employees/{id}/status — advance workflow status */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body,
                                          Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        Employee emp = employeeRepo.findById(id).orElse(null);
        if (emp == null) return ResponseEntity.notFound().build();

        try {
            EmployeeStatus newStatus = EmployeeStatus.valueOf(body.get("status"));
            emp.setStatus(newStatus);
            employeeRepo.save(emp);
            return ResponseEntity.ok(mapToDto(emp));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status: " + body.get("status")));
        }
    }

    /** PUT /api/employees/{id} — update employee personal details */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id,
                                            @RequestBody Map<String, String> body,
                                            Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        Employee emp = employeeRepo.findById(id).orElse(null);
        if (emp == null) return ResponseEntity.notFound().build();

        if (body.containsKey("phone")) emp.setPhone(body.get("phone"));
        if (body.containsKey("address")) emp.setAddress(body.get("address"));
        if (body.containsKey("cinNumber")) emp.setCinNumber(body.get("cinNumber"));
        if (body.containsKey("dateOfBirth") && body.get("dateOfBirth") != null) {
            try {
                emp.setDateOfBirth(java.time.LocalDate.parse(body.get("dateOfBirth")));
            } catch (Exception ignored) {}
        }
        if (body.containsKey("nationality")) emp.setNationality(body.get("nationality"));
        if (body.containsKey("fullName")) emp.setFullName(body.get("fullName"));

        employeeRepo.save(emp);
        return ResponseEntity.ok(mapToDto(emp));
    }

    // ─── Mapper ───────────────────────────────────────────────────────────────

    private EmployeeDto mapToDto(Employee emp) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(emp.getId());
        dto.setEmployeeNumber(emp.getEmployeeNumber());
        dto.setFullName(emp.getFullName());
        dto.setNationality(emp.getNationality());
        dto.setPhone(emp.getPhone());
        dto.setDateOfBirth(emp.getDateOfBirth());
        dto.setAddress(emp.getAddress());
        dto.setCinNumber(emp.getCinNumber());
        dto.setDepartment(emp.getDepartment());
        dto.setSalary(emp.getSalary());
        dto.setNetSalary(emp.getNetSalary());
        dto.setTaxExempt(emp.isTaxExempt());
        dto.setStatus(emp.getStatus());

        // Email / user info
        if (emp.getUser() != null) {
            dto.setEmail(emp.getUser().getEmail());
            dto.setUsername(emp.getUser().getUsername());
            dto.setUserId(emp.getUser().getId());
        }

        // Active assignment
        assignmentRepo.findByEmployeeId(emp.getId()).stream()
                .filter(a -> a.getStatus() == AssignmentStatus.ACTIVE)
                .findFirst()
                .ifPresent(a -> {
                    dto.setAssignmentId(a.getId());
                    if (a.getClientCompany() != null) {
                        dto.setClientCompanyName(a.getClientCompany().getName());
                        dto.setClientCompanyId(a.getClientCompany().getId());
                    }
                    if (a.getInfrastructureCompany() != null)
                        dto.setInfrastructureCompanyName(a.getInfrastructureCompany().getName());
                    if (a.getRecruitmentCompany() != null)
                        dto.setRecruitmentCompanyName(a.getRecruitmentCompany().getName());
                });

        // Active contract summary
        contractRepo.findFirstByEmployeeIdAndStatusOrderByCreatedAtDesc(emp.getId(), ContractStatus.ACTIVE)
                .ifPresent(c -> {
                    dto.setActiveContractId(c.getId());
                    dto.setContractType(c.getContractType() != null ? c.getContractType().name() : null);
                    dto.setPosition(c.getPosition());
                    dto.setContractGrossSalary(c.getGrossSalary());
                });

        // Sum infrastructure costs
        java.math.BigDecimal infraTotal = emp.getInfrastructureCosts() != null
                ? emp.getInfrastructureCosts().stream()
                        .map(InfrastructureCost::getAmount)
                        .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add)
                : java.math.BigDecimal.ZERO;
        dto.setInfraCostTotal(infraTotal);

        return dto;
    }
}

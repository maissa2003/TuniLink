package tn.stage.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.stage.backend.Classes.CompanyType;
import tn.stage.backend.Classes.Employee;
import tn.stage.backend.Classes.User;
import tn.stage.backend.Repositories.AssignmentRepository;
import tn.stage.backend.Repositories.CompanyRepository;
import tn.stage.backend.Repositories.EmployeeRepository;
import tn.stage.backend.Repositories.SalarySimulationRepository;
import tn.stage.backend.Repositories.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;
    private final AssignmentRepository assignmentRepository;
    private final SalarySimulationRepository salarySimulationRepository;

    public DashboardController(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            EmployeeRepository employeeRepository,
            AssignmentRepository assignmentRepository,
            SalarySimulationRepository salarySimulationRepository
    ) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
        this.assignmentRepository = assignmentRepository;
        this.salarySimulationRepository = salarySimulationRepository;
    }

    @GetMapping("/admin")
    public ResponseEntity<?> adminDashboard() {
        List<User> users = userRepository.findAll();
        List<Employee> employees = employeeRepository.findAll();
        var companies = companyRepository.findAll();

        BigDecimal monthlyPayroll = employees.stream()
                .map(employee -> employee.getSalary() != null ? employee.getSalary() : employee.getNetSalary())
                .filter(value -> value != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> recentUsers = users.stream()
                .sorted(Comparator.comparing(
                        User::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .limit(5)
                .map(user -> Map.<String, Object>of(
                        "type", "USER_CREATED",
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "status", user.getStatus() != null ? user.getStatus() : "",
                        "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
                ))
                .toList();

        return ResponseEntity.ok(Map.ofEntries(
                Map.entry("totalUsers", users.size()),
                Map.entry("activeUsers", users.stream().filter(user -> "ACTIVE".equals(user.getStatus())).count()),
                Map.entry("pendingUsers", users.stream().filter(user -> "PENDING".equals(user.getStatus())).count()),
                Map.entry("totalCompanies", companies.size()),
                Map.entry("infrastructureCompanies", companies.stream().filter(company -> company.getType() == CompanyType.INFRASTRUCTURE_PROVIDER).count()),
                Map.entry("recruitmentCompanies", companies.stream().filter(company -> company.getType() == CompanyType.RECRUITMENT_AGENCY).count()),
                Map.entry("clientCompanies", companies.stream().filter(company -> company.getType() == CompanyType.CLIENT).count()),
                Map.entry("totalEmployees", employees.size()),
                Map.entry("totalAssignments", assignmentRepository.count()),
                Map.entry("totalSimulations", salarySimulationRepository.count()),
                Map.entry("totalInvoices", 0),
                Map.entry("monthlyPayroll", monthlyPayroll),
                Map.entry("currency", "TND"),
                Map.entry("recentUsers", recentUsers),
                Map.entry("generatedAt", LocalDateTime.now().toString())
        ));
    }
}

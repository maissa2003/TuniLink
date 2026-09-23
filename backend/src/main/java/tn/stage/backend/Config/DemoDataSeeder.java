package tn.stage.backend.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.stage.backend.Classes.*;
import tn.stage.backend.Repositories.AssignmentRepository;
import tn.stage.backend.Repositories.CompanyRepository;
import tn.stage.backend.Repositories.EmployeeRepository;
import tn.stage.backend.Repositories.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DemoDataSeeder {

    @Bean
    CommandLineRunner seedDemoData(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            EmployeeRepository employeeRepository,
            AssignmentRepository assignmentRepository,
            tn.stage.backend.Repositories.EmployeeContractRepository contractRepository,
            tn.stage.backend.Repositories.InfrastructureCostRepository infraRepository,
            tn.stage.backend.Repositories.EmployeeEventRepository eventRepository,
            tn.stage.backend.Repositories.PayrollRecordRepository payrollRepository,
            tn.stage.backend.Repositories.InvoiceRepository invoiceRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.seed.demo:true}") boolean seedDemo) {
        return args -> {
            // Seed main demo data
            seedMainDemoData(userRepository, companyRepository, employeeRepository, assignmentRepository, passwordEncoder, seedDemo);
            
            // Seed Malek Hammami
            seedMalekHammami(userRepository, companyRepository, employeeRepository, assignmentRepository, contractRepository, infraRepository, eventRepository, payrollRepository, invoiceRepository, passwordEncoder);
        };
    }
    
    private void seedMainDemoData(UserRepository userRepository, CompanyRepository companyRepository, EmployeeRepository employeeRepository, AssignmentRepository assignmentRepository, PasswordEncoder passwordEncoder, boolean seedDemo) {
            if (!seedDemo || userRepository.findByEmail("gerant@vermeg.tn").isPresent()) {
                return;
            }

            Company vermeg = saveCompany(companyRepository, "Vermeg", CompanyType.RECRUITMENT_AGENCY, "Tunisia", "TND");
            Company tunilinkInfra = saveCompany(companyRepository, "TuniLink Infra", CompanyType.INFRASTRUCTURE_PROVIDER, "Tunisia", "TND");
            Company northBridge = saveCompany(companyRepository, "NorthBridge Tech", CompanyType.CLIENT, "Canada", "CAD");
            Company mapleSoft = saveCompany(companyRepository, "MapleSoft", CompanyType.CLIENT, "Canada", "CAD");

            String demoPassword = passwordEncoder.encode("demo123");

            // ── Internal staff accounts ─────────────────────────────────────
            User manager = saveUser(userRepository, "Karim Gérant",    "gerant@vermeg.tn",       demoPassword, Role.MANAGER,         vermeg);
            User hr      = saveUser(userRepository, "Mayssa RH",       "rh@vermeg.tn",            demoPassword, Role.HR,              vermeg);
            User finance = saveUser(userRepository, "Malek Finance",   "finance@vermeg.tn",       demoPassword, Role.FINANCE,         vermeg);
            User infra   = saveUser(userRepository, "Youssef Infra",   "infra@tunilink.tn",       demoPassword, Role.INFRASTRUCTURE,  tunilinkInfra);
            User client1 = saveUser(userRepository, "Walaa Client",    "client@northbridge.ca",   demoPassword, Role.CLIENT,          northBridge);
            User client2 = saveUser(userRepository, "Sarah Client",    "client@maplesoft.ca",     demoPassword, Role.CLIENT,          mapleSoft);

            // ── Employee accounts (developers / consultants) ──────────────
            User empUser1 = saveUser(userRepository, "Ahmed Employee",  "employee1@vermeg.tn",   demoPassword, Role.EMPLOYEE, vermeg);
            User empUser2 = saveUser(userRepository, "Sarra Employee",  "employee2@vermeg.tn",   demoPassword, Role.EMPLOYEE, vermeg);
            User empUser3 = saveUser(userRepository, "Sami Mejri",      "sami.mejri@vermeg.tn",  demoPassword, Role.EMPLOYEE, vermeg);

            // ── Employee profiles (ALL internal staff get a profile) ──────
            Employee empManager  = saveEmployee(employeeRepository, "EMP-000", "Karim Gérant",    "Management",    new BigDecimal("8500.00"), new BigDecimal("6200.00"), vermeg,       manager);
            Employee empHr       = saveEmployee(employeeRepository, "EMP-001", "Mayssa RH",       "Human Resources", new BigDecimal("5200.00"), new BigDecimal("3900.00"), vermeg,     hr);
            Employee empFinance  = saveEmployee(employeeRepository, "EMP-002", "Malek Finance",   "Finance",       new BigDecimal("5800.00"), new BigDecimal("4400.00"), vermeg,       finance);
            Employee empInfra    = saveEmployee(employeeRepository, "EMP-003", "Youssef Infra",   "Infrastructure",new BigDecimal("4800.00"), new BigDecimal("3600.00"), tunilinkInfra,infra);
            Employee employee1   = saveEmployee(employeeRepository, "EMP-004", "Ahmed Ben Ali",   "Engineering",   new BigDecimal("4200.00"), new BigDecimal("3200.00"), vermeg,       empUser1);
            Employee employee2   = saveEmployee(employeeRepository, "EMP-005", "Sarra Khelifi",   "QA & Testing",  new BigDecimal("3800.00"), new BigDecimal("2900.00"), vermeg,       empUser2);
            Employee employee3   = saveEmployee(employeeRepository, "EMP-006", "Sami Mejri",      "Backend Dev",   new BigDecimal("4500.00"), new BigDecimal("3400.00"), vermeg,       empUser3);

            // ── Assignments (consultants assigned to Canadian clients) ────
            saveAssignment(assignmentRepository, employee1, northBridge, tunilinkInfra, vermeg);
            saveAssignment(assignmentRepository, employee2, mapleSoft,   tunilinkInfra, vermeg);
            saveAssignment(assignmentRepository, employee3, northBridge, tunilinkInfra, vermeg);

            System.out.println("==> Demo data seeded (password: demo123 for all demo users)");
            System.out.println("    MANAGER : gerant@vermeg.tn  | HR    : rh@vermeg.tn");
            System.out.println("    FINANCE : finance@vermeg.tn | INFRA : infra@tunilink.tn");
            System.out.println("    CLIENTS : client@northbridge.ca, client@maplesoft.ca");
            System.out.println("    EMPLOYEES: employee1@vermeg.tn, employee2@vermeg.tn, sami.mejri@vermeg.tn");
    }
    
    private void seedMalekHammami(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            EmployeeRepository employeeRepository,
            AssignmentRepository assignmentRepository,
            tn.stage.backend.Repositories.EmployeeContractRepository contractRepository,
            tn.stage.backend.Repositories.InfrastructureCostRepository infraRepository,
            tn.stage.backend.Repositories.EmployeeEventRepository eventRepository,
            tn.stage.backend.Repositories.PayrollRecordRepository payrollRepository,
            tn.stage.backend.Repositories.InvoiceRepository invoiceRepository,
            PasswordEncoder passwordEncoder) {
            
        if (employeeRepository.findByEmployeeNumber("EMP-MALEK-001").isPresent()) {
            return;
        }

        Company vermeg = companyRepository.findAll().stream().filter(c -> c.getName().equals("Vermeg")).findFirst().orElse(null);
        Company tunilinkInfra = companyRepository.findAll().stream().filter(c -> c.getName().equals("TuniLink Infra")).findFirst().orElse(null);
        Company northBridge = companyRepository.findAll().stream().filter(c -> c.getName().equals("NorthBridge Tech")).findFirst().orElse(null);
        
        if (vermeg == null || tunilinkInfra == null || northBridge == null) return;

        User hrUser = userRepository.findByEmail("rh@vermeg.tn").orElse(null);
        User infraUser = userRepository.findByEmail("infra@tunilink.tn").orElse(null);

        // 1. Create User
        User malekUser = new User();
        malekUser.setUsername("Malek Hammami");
        malekUser.setEmail("malek.hammami@vermeg.tn");
        malekUser.setPassword(passwordEncoder.encode("demo123"));
        malekUser.setRole(Role.EMPLOYEE);
        malekUser.setCompany(vermeg);
        malekUser.setStatus("ACTIVE");
        userRepository.save(malekUser);

        // 2. Create Employee
        Employee malek = new Employee();
        malek.setEmployeeNumber("EMP-MALEK-001");
        malek.setFullName("Malek Hammami");
        malek.setNationality("Tunisian");
        malek.setDepartment("Engineering");
        malek.setSalary(new BigDecimal("4500.00"));
        malek.setNetSalary(new BigDecimal("3400.00"));
        malek.setStatus(EmployeeStatus.CONTRACT_CREATED);
        malek.setCompany(vermeg);
        malek.setUser(malekUser);
        employeeRepository.save(malek);

        // 3. Assignment
        Assignment assignment = new Assignment();
        assignment.setEmployee(malek);
        assignment.setClientCompany(northBridge);
        assignment.setInfrastructureCompany(tunilinkInfra);
        assignment.setRecruitmentCompany(vermeg);
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setStartDate(LocalDate.of(2025, 3, 1));
        assignmentRepository.save(assignment);

        // 4. Contract
        EmployeeContract contract = new EmployeeContract();
        contract.setEmployee(malek);
        contract.setContractType(ContractType.CDI);
        contract.setPosition("Senior Java Developer");
        contract.setStartDate(LocalDate.of(2025, 3, 1));
        contract.setEndDate(LocalDate.of(2027, 3, 1));
        contract.setGrossSalary(new BigDecimal("4500.00"));
        contract.setBonus(new BigDecimal("500.00"));
        contract.setStatus(ContractStatus.ACTIVE);
        contract.setCreatedBy(hrUser);
        contractRepository.save(contract);
        
        EmployeeEvent event1 = new EmployeeEvent();
        event1.setEmployee(malek);
        event1.setEventType("CONTRACT_CREATED");
        event1.setDescription("HR created employment contract: CDI, 4500 TND gross");
        event1.setPerformedBy(hrUser);
        event1.setOccurredAt(java.time.LocalDateTime.now().minusDays(2));
        eventRepository.save(event1);

        // 5. Infrastructure Resources
        Object[][] resources = {
            {InfrastructureCostCategory.LAPTOP, "Dell Latitude 5540", "250.00"},
            {InfrastructureCostCategory.OFFICE_RENT, "Open Space B2", "400.00"},
            {InfrastructureCostCategory.INTERNET, "Fiber Optic", "50.00"},
            {InfrastructureCostCategory.ELECTRICITY, "Office power", "65.00"},
            {InfrastructureCostCategory.MS_LICENSE, "MS365 Business Premium", "35.00"},
            {InfrastructureCostCategory.CLOUD_SERVICES, "Azure VM Standard", "180.00"},
            {InfrastructureCostCategory.IT_SUPPORT, "Standard tier", "30.00"}
        };
        
        for (Object[] res : resources) {
            InfrastructureCost cost = new InfrastructureCost();
            cost.setEmployee(malek);
            cost.setCompany(tunilinkInfra);
            cost.setCategory((InfrastructureCostCategory) res[0]);
            cost.setResourceName((String) res[1]);
            cost.setDescription("Standard allocation");
            cost.setAssignmentDate(LocalDate.of(2025, 3, 1));
            cost.setAssignedBy(infraUser);
            cost.setAmount(new BigDecimal((String) res[2]));
            infraRepository.save(cost);
            
            EmployeeEvent evt = new EmployeeEvent();
            evt.setEmployee(malek);
            evt.setEventType("RESOURCE_ASSIGNED");
            evt.setDescription("Assigned resource: " + res[1]);
            evt.setPerformedBy(infraUser);
            evt.setOccurredAt(java.time.LocalDateTime.now().minusDays(1));
            eventRepository.save(evt);
        }
    }

    private Company saveCompany(CompanyRepository repo, String name, CompanyType type, String country, String currency) {
        return repo.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Company company = new Company();
                    company.setName(name);
                    company.setType(type);
                    company.setCountry(country);
                    company.setCurrency(currency);
                    company.setTaxRate(new BigDecimal("19.00"));
                    return repo.save(company);
                });
    }

    private User saveUser(UserRepository repo, String username, String email, String password, Role role, Company company) {
        Optional<User> existing = repo.findByEmail(email);
        if (existing.isPresent()) return existing.get();
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setCompany(company);
        user.setStatus("ACTIVE");
        return repo.save(user);
    }

    private Employee saveEmployee(EmployeeRepository repo, String number, String fullName,
                                  String department, BigDecimal salary, BigDecimal netSalary,
                                  Company company, User user) {
        return repo.findAll().stream()
                .filter(e -> e.getEmployeeNumber().equals(number))
                .findFirst()
                .orElseGet(() -> {
                    Employee employee = new Employee();
                    employee.setEmployeeNumber(number);
                    employee.setFullName(fullName);
                    employee.setNationality("Tunisian");
                    employee.setDepartment(department);
                    employee.setSalary(salary);
                    employee.setNetSalary(netSalary);
                    employee.setStatus(EmployeeStatus.ACTIVE);
                    employee.setCompany(company);
                    employee.setUser(user);
                    return repo.save(employee);
                });
    }

    private void saveAssignment(AssignmentRepository repo, Employee employee, Company client,
                                Company infra, Company agency) {
        boolean exists = repo.findAll().stream()
                .anyMatch(a -> a.getEmployee().getId().equals(employee.getId())
                        && a.getClientCompany().getId().equals(client.getId()));
        if (exists) return;

        Assignment assignment = new Assignment();
        assignment.setEmployee(employee);
        assignment.setClientCompany(client);
        assignment.setInfrastructureCompany(infra);
        assignment.setRecruitmentCompany(agency);
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setStartDate(LocalDate.of(2025, 1, 15));
        repo.save(assignment);
    }
}

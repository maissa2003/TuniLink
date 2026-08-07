package tn.stage.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.stage.backend.Classes.*;
import tn.stage.backend.DTO.CandidateDto;
import tn.stage.backend.DTO.EmployeeDto;
import tn.stage.backend.Repositories.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepo;
    private final ResourceRequestRepository requestRepo;
    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final AssignmentRepository assignmentRepo;
    private final CompanyRepository companyRepo;
    private final EmployeeEventRepository eventRepo;
    private final CvStorageService cvStorageService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    // ── Public apply (no authentication required) ──────────────────────────────

    /**
     * A candidate submits their application via the public Landing Page.
     * No JWT required. Saves candidate data and CV file.
     */
    @Transactional
    public CandidateDto applyPublic(
            String firstName, String lastName, String email, String phone,
            String linkedinUrl, String skills, Integer yearsOfExperience,
            String expectedSalary, String availabilityDate,
            MultipartFile cvFile) throws IOException {

        if (candidateRepo.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("An application with this email already exists.");
        }

        Candidate candidate = new Candidate();
        candidate.setFirstName(firstName.trim());
        candidate.setLastName(lastName.trim());
        candidate.setEmail(email.trim().toLowerCase());
        candidate.setPhone(phone);
        candidate.setLinkedinUrl(linkedinUrl);
        candidate.setSkills(skills);
        candidate.setYearsOfExperience(yearsOfExperience);
        if (expectedSalary != null && !expectedSalary.isBlank()) {
            candidate.setExpectedSalary(new java.math.BigDecimal(expectedSalary));
        }
        if (availabilityDate != null && !availabilityDate.isBlank()) {
            candidate.setAvailabilityDate(LocalDate.parse(availabilityDate));
        }
        candidate.setStatus(CandidateStatus.NEW_APPLICATION);

        // Store CV file using abstracted service
        if (cvFile != null && !cvFile.isEmpty()) {
            String storedPath = cvStorageService.store(cvFile, email);
            candidate.setCvFilePath(storedPath);
            candidate.setCvOriginalFilename(cvFile.getOriginalFilename());
            candidate.setCvUploadedAt(LocalDateTime.now());
        }

        return mapToDto(candidateRepo.save(candidate));
    }

    // ── HR Actions ─────────────────────────────────────────────────────────────

    public List<CandidateDto> getAllCandidates() {
        return candidateRepo.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public CandidateDto getCandidateById(Long id) {
        return mapToDto(candidateRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found: " + id)));
    }

    @Transactional
    public CandidateDto markUnderReview(Long id, String hrEmail) {
        Candidate candidate = getCandidate(id);
        candidate.setStatus(CandidateStatus.UNDER_REVIEW);
        candidate.setReviewedBy(getUser(hrEmail));
        return mapToDto(candidateRepo.save(candidate));
    }

    @Transactional
    public CandidateDto scheduleInterview(Long id, String hrEmail) {
        Candidate candidate = getCandidate(id);
        candidate.setStatus(CandidateStatus.INTERVIEW_SCHEDULED);
        candidate.setReviewedBy(getUser(hrEmail));
        return mapToDto(candidateRepo.save(candidate));
    }

    @Transactional
    public CandidateDto rejectCandidate(Long id, String reason, String hrEmail) {
        Candidate candidate = getCandidate(id);
        if (candidate.getStatus() == CandidateStatus.HIRED) {
            throw new IllegalStateException("Cannot reject a candidate who has already been hired.");
        }
        candidate.setStatus(CandidateStatus.REJECTED);
        candidate.setRejectionReason(reason);
        candidate.setReviewedBy(getUser(hrEmail));
        return mapToDto(candidateRepo.save(candidate));
    }

    /**
     * HR hires a candidate. This is the pivotal workflow action.
     *
     * What this method does atomically:
     *  1. Validates candidate and request exist
     *  2. Generates employee number
     *  3. Creates User (role=EMPLOYEE, status=PENDING, temp password)
     *  4. Creates Employee (status=RECRUITED)
     *  5. Creates Assignment linking employee ↔ client ↔ infra ↔ agency
     *  6. Updates candidate status to HIRED and links to employee
     *  7. Updates ResourceRequest status to FULFILLED
     *  8. Fires EmployeeEvent("RECRUITED")
     *  9. Sends activation email to the new employee
     */
    @Transactional
    public EmployeeDto hireCandidateAsEmployee(Long candidateId, Long resourceRequestId, String hrEmail) {
        Candidate candidate = getCandidate(candidateId);
        User hrUser = getUser(hrEmail);

        if (candidate.getStatus() == CandidateStatus.HIRED) {
            throw new IllegalStateException("This candidate has already been hired.");
        }
        if (candidate.getStatus() == CandidateStatus.REJECTED) {
            throw new IllegalStateException("Cannot hire a rejected candidate.");
        }

        ResourceRequest request = requestRepo.findById(resourceRequestId)
                .orElseThrow(() -> new IllegalArgumentException("Hiring request not found: " + resourceRequestId));

        Company clientCompany = request.getClientCompany();
        Company agencyCompany = hrUser.getCompany(); // Recruitment agency

        // Find the infrastructure provider (first INFRASTRUCTURE_PROVIDER company)
        Company infraCompany = companyRepo.findAll().stream()
                .filter(c -> c.getType() == CompanyType.INFRASTRUCTURE_PROVIDER)
                .findFirst()
                .orElse(agencyCompany); // fallback

        // 1. Generate temporary password
        String tempPassword = UUID.randomUUID().toString().substring(0, 12);

        // 2. Create User account
        String baseUsername = (candidate.getFirstName() + "." + candidate.getLastName())
                .toLowerCase().replaceAll("\\s+", "");
        // Ensure unique username
        final String checkUsername = baseUsername;
        if (userRepo.findAll().stream().anyMatch(u -> u.getUsername().equals(checkUsername))) {
            baseUsername = baseUsername + System.currentTimeMillis() % 1000;
        }
        String username = baseUsername;

        User empUser = new User();
        empUser.setUsername(username);
        empUser.setEmail(candidate.getEmail());
        empUser.setPassword(passwordEncoder.encode(tempPassword));
        empUser.setRole(Role.EMPLOYEE);
        empUser.setStatus("PENDING"); // Forces password change on first login
        empUser.setCompany(agencyCompany);
        userRepo.save(empUser);

        // 3. Create Employee record
        String employeeNumber = "EMP-" + String.format("%04d", employeeRepo.count() + 1);
        Employee employee = new Employee();
        employee.setEmployeeNumber(employeeNumber);
        employee.setFullName(candidate.getFirstName() + " " + candidate.getLastName());
        employee.setNationality("Tunisian"); // default, HR can update later
        employee.setDepartment("Engineering");  // default, HR can update later
        employee.setStatus(EmployeeStatus.RECRUITED);
        employee.setCompany(agencyCompany);
        employee.setUser(empUser);
        employeeRepo.save(employee);

        // 4. Create Assignment (Employee ↔ Client ↔ Infra ↔ Agency)
        Assignment assignment = new Assignment();
        assignment.setEmployee(employee);
        assignment.setClientCompany(clientCompany);
        assignment.setInfrastructureCompany(infraCompany);
        assignment.setRecruitmentCompany(agencyCompany);
        assignment.setStatus(AssignmentStatus.ACTIVE);
        assignment.setStartDate(LocalDate.now());
        assignmentRepo.save(assignment);

        // 5. Link candidate → employee, mark HIRED
        candidate.setStatus(CandidateStatus.HIRED);
        candidate.setConvertedEmployee(employee);
        candidate.setReviewedBy(hrUser);
        candidate.setResourceRequest(request);
        candidateRepo.save(candidate);

        // 6. Mark request as fulfilled
        request.setStatus(RequestStatus.FULFILLED);
        requestRepo.save(request);

        // 7. Fire EmployeeEvent
        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(employee);
        event.setEventType("RECRUITED");
        event.setDescription("Candidate " + candidate.getFullName() + " hired via request: " + request.getTitle());
        event.setPerformedBy(hrUser);
        eventRepo.save(event);

        // 8. Send activation email to the new employee
        emailService.sendCandidateHiredEmail(candidate.getEmail(), candidate.getFullName(), tempPassword);

        return mapEmployeeToDto(employee, assignment);
    }

    // ── CV download (HR only) ───────────────────────────────────────────────────

    public byte[] downloadCv(Long candidateId) throws IOException {
        Candidate candidate = getCandidate(candidateId);
        if (candidate.getCvFilePath() == null) {
            throw new IllegalStateException("No CV uploaded for this candidate.");
        }
        return cvStorageService.retrieve(candidate.getCvFilePath());
    }

    public String getCvFilename(Long candidateId) {
        Candidate candidate = getCandidate(candidateId);
        return candidate.getCvOriginalFilename() != null
                ? candidate.getCvOriginalFilename()
                : "cv-" + candidateId + ".pdf";
    }

    // ── Private helpers ─────────────────────────────────────────────────────────

    private Candidate getCandidate(Long id) {
        return candidateRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found: " + id));
    }

    private User getUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
    }

    private CandidateDto mapToDto(Candidate c) {
        CandidateDto dto = new CandidateDto();
        dto.setId(c.getId());
        dto.setFirstName(c.getFirstName());
        dto.setLastName(c.getLastName());
        dto.setFullName(c.getFullName());
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setLinkedinUrl(c.getLinkedinUrl());
        dto.setCvOriginalFilename(c.getCvOriginalFilename());
        dto.setCvUploadedAt(c.getCvUploadedAt());
        dto.setHasCv(c.getCvFilePath() != null);
        dto.setSkills(c.getSkills());
        dto.setYearsOfExperience(c.getYearsOfExperience());
        dto.setExpectedSalary(c.getExpectedSalary());
        dto.setAvailabilityDate(c.getAvailabilityDate());
        dto.setStatus(c.getStatus());
        dto.setRejectionReason(c.getRejectionReason());
        if (c.getResourceRequest() != null) {
            dto.setResourceRequestId(c.getResourceRequest().getId());
            dto.setResourceRequestTitle(c.getResourceRequest().getTitle());
        }
        if (c.getConvertedEmployee() != null) {
            dto.setConvertedEmployeeId(c.getConvertedEmployee().getId());
        }
        if (c.getReviewedBy() != null) {
            dto.setReviewedByName(c.getReviewedBy().getUsername());
        }
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    private EmployeeDto mapEmployeeToDto(Employee emp, Assignment assignment) {
        EmployeeDto dto = new EmployeeDto();
        dto.setId(emp.getId());
        dto.setEmployeeNumber(emp.getEmployeeNumber());
        dto.setFullName(emp.getFullName());
        dto.setStatus(emp.getStatus());
        if (emp.getUser() != null) {
            dto.setEmail(emp.getUser().getEmail());
            dto.setUserId(emp.getUser().getId());
        }
        if (assignment != null && assignment.getClientCompany() != null) {
            dto.setAssignmentId(assignment.getId());
            dto.setClientCompanyName(assignment.getClientCompany().getName());
            dto.setClientCompanyId(assignment.getClientCompany().getId());
        }
        return dto;
    }
}

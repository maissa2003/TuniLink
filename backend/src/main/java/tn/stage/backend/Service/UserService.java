package tn.stage.backend.Service;

import tn.stage.backend.Classes.Company;
import tn.stage.backend.Classes.User;
import tn.stage.backend.DTO.CreateUserByAdminRequest;
import tn.stage.backend.DTO.UpdateUserRequest;
import tn.stage.backend.DTO.UserSummary;
import tn.stage.backend.Repositories.CompanyRepository;
import tn.stage.backend.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.stage.backend.Classes.Role;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public UserService(UserRepository userRepository, CompanyRepository companyRepository,
                        PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public List<UserSummary> getAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserSummary create(CreateUserByAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));
        user.setCompany(company);
        user.setStatus(request.isSendInvite() ? "PENDING" : "ACTIVE");

        User saved = userRepository.save(user);

        System.out.println("sendInvite = " + request.isSendInvite());

        if (request.isSendInvite()) {

            System.out.println("Calling EmailService...");

            emailService.sendWelcomeEmail(
                    saved.getEmail(),
                    saved.getUsername(),
                    request.getPassword());

            System.out.println("Returned from EmailService.");
        }
        return toResponse(saved);
    }

    public UserSummary update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());  
        user.setStatus(request.getStatus());

        return toResponse(userRepository.save(user));
    }

    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserSummary toResponse(User user) {
        Company company = user.getCompany();
        return new UserSummary(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus(),
                company != null ? company.getId() : null,
                company != null ? company.getName() : null,
                toIsoUtc(user.getCreatedAt()),
                toIsoUtc(user.getLastLoginAt()),
                user.getProfilePicture()
        );
    }

    /** Server stores UTC wall time; serialize with Z so browsers parse correctly. */
    private static String toIsoUtc(LocalDateTime value) {
        if (value == null) return null;
        return value.atOffset(ZoneOffset.UTC).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
//g$pDkQ#6po
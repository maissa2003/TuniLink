package tn.stage.backend.Controller;

import tn.stage.backend.Classes.Company;
import tn.stage.backend.Classes.Role;
import tn.stage.backend.Classes.User;
import tn.stage.backend.DTO.CreateUserByAdminRequest;
import tn.stage.backend.DTO.UpdateUserRequest;
import tn.stage.backend.DTO.UserSummary;
import tn.stage.backend.Repositories.CompanyRepository;
import tn.stage.backend.Repositories.UserRepository;
import tn.stage.backend.Security.RoleCompanyValidator;
import tn.stage.backend.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public UserController(UserRepository userRepository, CompanyRepository companyRepository,
                          PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @GetMapping
    public List<UserSummary> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserByAdminRequest request) {
        try {
            UserSummary created = userService.create(request);
            return ResponseEntity.ok(Map.of("message", "Utilisateur créé.", "id", created.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return userRepository.findById(id).map(user -> {
            if (request.getUsername() != null) user.setUsername(request.getUsername());
            if (request.getEmail() != null) user.setEmail(request.getEmail());
            if (request.getRole() != null) {
                Role newRole = Role.valueOf(request.getRole());
                if (user.getCompany() != null && !RoleCompanyValidator.isAllowed(user.getCompany().getType(), newRole)) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "message", "Ce rôle n'est pas autorisé pour l'entreprise de cet utilisateur."
                    ));
                }
                user.setRole(newRole);
            }
            if (request.getStatus() != null) user.setStatus(request.getStatus());
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Utilisateur mis à jour."));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Utilisateur supprimé."));
    }
}
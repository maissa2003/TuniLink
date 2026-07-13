package tn.stage.backend.Service;


import tn.stage.backend.DTO.AuthResponse;
import tn.stage.backend.DTO.LoginRequest;
import tn.stage.backend.DTO.SignupRequest;
import tn.stage.backend.Classes.Role;
import tn.stage.backend.Classes.User;
import tn.stage.backend.Repositories.UserRepository;
import tn.stage.backend.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LastLoginService lastLoginService;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil,
                       LastLoginService lastLoginService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.lastLoginService = lastLoginService;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.EMPLOYEE);
        user.setStatus("ACTIVE");

        userRepository.save(user);

        lastLoginService.recordLogin(user.getEmail());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if ("DISABLED".equals(user.getStatus())) {
            throw new IllegalArgumentException("This account has been disabled. Contact your administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        lastLoginService.recordLogin(user.getEmail());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return toAuthResponse(user, token);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException("New password must contain at least 8 characters");
        }
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setStatus("ACTIVE");
        userRepository.save(user);
        lastLoginService.recordLogin(email);
    }
    public AuthResponse loginWithGoogle(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No TuniLink account exists for this Google email. Ask your administrator to invite you first."));

        if ("DISABLED".equals(user.getStatus())) {
            throw new IllegalArgumentException("This account has been disabled. Contact your administrator.");
        }
        if ("PENDING".equals(user.getStatus())) {
            throw new IllegalArgumentException(
                    "Please sign in with your temporary password and change it before using Google sign-in.");
        }

        lastLoginService.recordLogin(user.getEmail());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return toAuthResponse(user, token);
    }
    public AuthResponse createAdmin(SignupRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new IllegalArgumentException("Cet email est déjà utilisé.");
    }

    User admin = new User();
    admin.setUsername(request.getUsername());
    admin.setEmail(request.getEmail());
    admin.setPassword(passwordEncoder.encode(request.getPassword()));
    admin.setRole(Role.ADMIN);
    admin.setStatus("ACTIVE");

    userRepository.save(admin);

    lastLoginService.recordLogin(admin.getEmail());
    String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole().name());
    return toAuthResponse(admin, token);
}

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus(),
                user.getProfilePicture()
        );
    }
}

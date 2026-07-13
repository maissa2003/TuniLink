package tn.stage.backend.Controller;

import tn.stage.backend.DTO.AuthResponse;
import tn.stage.backend.DTO.ChangePasswordRequest;
import org.springframework.security.core.Authentication;
import tn.stage.backend.DTO.GoogleLoginRequest;
import tn.stage.backend.DTO.LoginRequest;
import tn.stage.backend.DTO.SignupRequest;
import tn.stage.backend.Service.AuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Value("${google.client-id:}")
    private String googleClientId;



    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Invalid Google token"));
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            AuthResponse response = authService.loginWithGoogle(email);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Google authentication failed"));
        }
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
            }
            authService.changePassword(authentication.getName(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Your password has been updated successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/connect-google")
    public ResponseEntity<?> connectGoogle(@RequestBody GoogleLoginRequest request, Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Authentication required"));
            }
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId)).build();
            GoogleIdToken idToken = verifier.verify(request.getCredential());
            if (idToken == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Google connection could not be verified"));
            }
            String googleEmail = idToken.getPayload().getEmail();
            if (!authentication.getName().equalsIgnoreCase(googleEmail)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Use the same Google email as your TuniLink account"));
            }
            return ResponseEntity.ok(Map.of("message", "Google account connected. You can now sign in with Google."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Google connection could not be verified"));
        }
    }
@PostMapping("/admin")
public ResponseEntity<?> createAdmin(@RequestBody SignupRequest request) {
    try {
        AuthResponse response = authService.createAdmin(request);
        return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
}
}

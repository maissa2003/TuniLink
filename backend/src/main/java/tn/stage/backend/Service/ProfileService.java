package tn.stage.backend.Service;

import org.springframework.stereotype.Service;
import tn.stage.backend.Classes.User;
import tn.stage.backend.DTO.ProfileResponse;
import tn.stage.backend.DTO.ProfileUpdateRequest;
import tn.stage.backend.Repositories.UserRepository;

@Service
public class ProfileService {

    private static final int MAX_PROFILE_PICTURE_LENGTH = 500_000;

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    public ProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getUsername() != null) {
            String username = request.getUsername().trim();
            if (username.isEmpty()) {
                throw new IllegalArgumentException("Display name cannot be empty");
            }
            user.setUsername(username);
        }

        if (request.getProfilePicture() != null) {
            String picture = request.getProfilePicture().trim();
            if (picture.isEmpty()) {
                user.setProfilePicture(null);
            } else {
                if (picture.length() > MAX_PROFILE_PICTURE_LENGTH) {
                    throw new IllegalArgumentException("Profile picture is too large. Use a smaller image.");
                }
                user.setProfilePicture(picture);
            }
        }

        return toResponse(userRepository.save(user));
    }

    private ProfileResponse toResponse(User user) {
        return new ProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.getProfilePicture()
        );
    }
}

package tn.stage.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProfileResponse {
    private String username;
    private String email;
    private String role;
    private String profilePicture;
}

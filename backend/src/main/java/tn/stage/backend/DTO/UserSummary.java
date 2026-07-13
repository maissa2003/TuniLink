package tn.stage.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class UserSummary {
    private Long id;
    private String username;
    private String email;
    private String role;
    private String status;
    private Long companyId;
    private String companyName;
    private String createdAt;
    private String lastLoginAt;
    private String profilePicture;
}
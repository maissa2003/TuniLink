package tn.stage.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateUserByAdminRequest {
    private String username;
    private String email;
    private String password;
    private Long companyId;
    private String role;
    private boolean sendInvite;
}
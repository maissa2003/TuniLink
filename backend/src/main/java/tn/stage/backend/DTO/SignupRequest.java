package tn.stage.backend.DTO;

import lombok.Getter;
import lombok.Setter;
import tn.stage.backend.Classes.Role;

@Getter
@Setter
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
}

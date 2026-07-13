package tn.stage.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import tn.stage.backend.Classes.Role;
import tn.stage.backend.Classes.User;
import tn.stage.backend.Repositories.UserRepository;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository,
                                       PasswordEncoder passwordEncoder,
                                       @Value("${app.admin.email:admin@example.com}") String adminEmail,
                                       @Value("${app.admin.username:admin}") String adminUsername,
                                       @Value("${app.admin.password:admin123}") String adminPassword) {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole(Role.ADMIN);
                admin.setStatus("ACTIVE");
                userRepository.save(admin);
                System.out.println("==> Admin user created: " + adminEmail);
            } else {
                System.out.println("==> Admin user already exists: " + adminEmail);
            }
        };
    }
}

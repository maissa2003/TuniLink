package tn.stage.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tn.stage.backend.Repositories.UserRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void contextLoadsAndCreatesAdminUser() {
        assertTrue(userRepository.findByEmail("admin@example.com").isPresent());
    }
}

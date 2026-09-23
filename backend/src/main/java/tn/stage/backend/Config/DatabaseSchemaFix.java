package tn.stage.backend.Config;

import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFix {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFix(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void applyMigrations() {
        try {
            jdbcTemplate.execute("ALTER TABLE users DROP COLUMN IF EXISTS language");
        } catch (Exception ex) {
            System.err.println("Legacy language column migration skipped: " + ex.getMessage());
        }
        try {
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            jdbcTemplate.execute("""
                ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (
                  role::text = ANY (ARRAY[
                    'ADMIN','MANAGER','HR','FINANCE','INFRASTRUCTURE','CLIENT','EMPLOYEE'
                  ]::text[])
                )
                """);
        } catch (Exception ex) {
            System.err.println("Role check constraint migration skipped: " + ex.getMessage());
        }
    }
}

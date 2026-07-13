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
    public void removeLegacyLanguageColumn() {
        try {
            jdbcTemplate.execute("ALTER TABLE users DROP COLUMN IF EXISTS language");
        } catch (Exception ex) {
            // Ignore migration failures during startup so the app can still boot.
            System.err.println("Legacy language column migration skipped: " + ex.getMessage());
        }
    }
}

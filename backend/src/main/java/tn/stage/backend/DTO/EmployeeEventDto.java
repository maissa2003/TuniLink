package tn.stage.backend.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmployeeEventDto {
    private Long id;
    private String eventType;
    private String description;
    private String performedByName;
    private LocalDateTime occurredAt;
}

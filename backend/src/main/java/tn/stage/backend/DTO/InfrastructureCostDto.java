package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.InfrastructureCostCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InfrastructureCostDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private InfrastructureCostCategory category;
    private BigDecimal amount;
    private String resourceName;
    private String description;
    private LocalDate assignmentDate;
    private String assignedByName;
    private String companyName;
    private LocalDateTime createdAt;
}

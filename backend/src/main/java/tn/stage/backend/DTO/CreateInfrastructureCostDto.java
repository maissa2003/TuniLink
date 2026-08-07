package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.InfrastructureCostCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateInfrastructureCostDto {
    private InfrastructureCostCategory category;
    private BigDecimal amount;
    private String resourceName;
    private String description;
    private LocalDate assignmentDate;
}

package tn.stage.backend.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.math.BigDecimal;

@Data
public class CreateResourceRequestDto {
    private String title;
    private String description;
    private LocalDate targetDate;
    
    private String seniorityLevel;
    private String workMode;
    private String requiredSkills;
    private BigDecimal estimatedBudgetCad;
    private BigDecimal annualRaisePercent;
}

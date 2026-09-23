package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.RequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
public class ResourceRequestDto {
    private Long id;
    private Long clientCompanyId;
    private String clientCompanyName;
    private String title;
    private String description;
    private LocalDate targetDate;
    
    private String seniorityLevel;
    private String workMode;
    private String requiredSkills;
    private BigDecimal estimatedBudgetCad;
    private BigDecimal annualRaisePercent;
    private String simulationDetails;
    private String rejectionReason;

    private RequestStatus status;
    private Long assignmentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

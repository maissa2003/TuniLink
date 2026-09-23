package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.ContractStatus;
import tn.stage.backend.Classes.ContractType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EmployeeContractDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private ContractType contractType;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal grossSalary;
    private BigDecimal bonus;
    private ContractStatus status;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

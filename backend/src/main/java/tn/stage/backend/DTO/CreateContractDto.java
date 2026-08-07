package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.ContractType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateContractDto {
    private ContractType contractType;
    private String position;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal grossSalary;
    private BigDecimal bonus;
}

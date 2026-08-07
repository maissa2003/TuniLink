package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.EmployeeStatus;

import java.math.BigDecimal;

@Data
public class EmployeeDto {
    private Long id;
    private String employeeNumber;
    private String fullName;
    private String nationality;
    private String phone;
    private java.time.LocalDate dateOfBirth;
    private String address;
    private String cinNumber;
    private String department;
    private BigDecimal salary;
    private BigDecimal netSalary;
    private boolean taxExempt;
    private EmployeeStatus status;
    private String documentPath;

    // Denormalized from Assignment (active)
    private Long assignmentId;
    private String clientCompanyName;
    private Long clientCompanyId;
    private String infrastructureCompanyName;
    private String recruitmentCompanyName;

    // Active contract summary (if any)
    private Long activeContractId;
    private String contractType;
    private String position;
    private BigDecimal contractGrossSalary;
    private BigDecimal infraCostTotal;

    // From User
    private String email;
    private String username;
    private Long userId;
}

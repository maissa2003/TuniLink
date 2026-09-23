package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.PayrollStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PayrollRecordDto {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private Long contractId;
    private LocalDate periodMonth;

    // Employee payslip
    private BigDecimal grossSalary;
    private BigDecimal employeeCnss;
    private BigDecimal irppTax;
    private BigDecimal bonus;
    private BigDecimal netSalary;

    // Employer cost
    private BigDecimal employerCnss;
    private BigDecimal infraCostTotal;
    private BigDecimal recruitmentMargin;
    private BigDecimal infraMargin;
    private BigDecimal totalEmployerCostTnd;
    private BigDecimal finalInvoiceCad;
    private BigDecimal exchangeRateUsed;

    private PayrollStatus status;
    private String validatedByName;
    private LocalDateTime validatedAt;
    private LocalDateTime createdAt;

    // Budget projections
    private BigDecimal monthlyBudgetTnd;
    private BigDecimal annualBudgetTnd;
    private java.util.List<YearProjectionDto> yearProjections;
}

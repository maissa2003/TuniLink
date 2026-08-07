package tn.stage.backend.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SimulationYearDto {
    private Integer year;
    private BigDecimal netSalaryTnd;
    private BigDecimal grossSalaryTnd;
    private BigDecimal employerChargesTnd;
    private BigDecimal totalPayrollCostTnd;
    private BigDecimal infrastructureCostTnd;
    private BigDecimal subTotalBeforeMarginTnd;
    private BigDecimal recruitmentMarginAmountTnd;
    private BigDecimal infrastructureMarginAmountTnd;
    private BigDecimal totalCostTnd;
    private BigDecimal exchangeRateUsed;
    private BigDecimal finalInvoicedCad;
}

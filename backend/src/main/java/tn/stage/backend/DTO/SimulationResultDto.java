package tn.stage.backend.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SimulationResultDto {
    private String scenarioName;
    private String candidateName;
    private String candidateBio;
    private BigDecimal baseNetSalaryTnd;
    private Integer durationYears;
    private BigDecimal annualIncreasePercent;
    private BigDecimal recruitmentMarginPercent;
    private BigDecimal infrastructureMarginPercent;
    private BigDecimal fixedInfrastructureCostTnd;
    private BigDecimal exchangeRateTndToCad;
    private List<SimulationYearDto> years;

    // Totals summary
    private BigDecimal totalCostOverPeriodCad;
    private BigDecimal averageMonthlyCostCad;
}

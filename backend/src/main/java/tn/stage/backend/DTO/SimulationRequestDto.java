package tn.stage.backend.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SimulationRequestDto {
    // Inputs
    private Long resourceRequestId;       // link to the client's request
    private String scenarioName;          // e.g. "Scénario A – Hausse 5%/an"
    private BigDecimal baseNetSalaryTnd;  // Net salary candidate wants (TND)
    private Integer durationYears;        // simulation horizon (1-10 years)
    private BigDecimal annualIncreasePercent; // e.g. 5.00 for 5% per year

    // Overrides (optional – will use DB/defaults if null)
    private BigDecimal recruitmentMarginPercent;  // agency margin, default 10%
    private BigDecimal infrastructureMarginPercent; // infra margin, default 10%
    private BigDecimal fixedInfrastructureCostTnd; // office+PC+internet, default 500 TND/month
    private BigDecimal exchangeRateTndToCad;       // TND→CAD rate, default from DB or 0.45
}

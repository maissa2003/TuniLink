package tn.stage.backend.Service;

import org.springframework.stereotype.Service;
import tn.stage.backend.DTO.SimulationRequestDto;
import tn.stage.backend.DTO.SimulationResultDto;
import tn.stage.backend.DTO.SimulationYearDto;
import tn.stage.backend.Repositories.ExchangeRateRepository;
import tn.stage.backend.Repositories.MarginConfigRepository;
import tn.stage.backend.Repositories.ResourceRequestRepository;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Core financial calculation engine.
 *
 * Tunisian tax constants (approximations – adjust to current legislation):
 *   Employee CNSS rate : 9.18%
 *   Employer CNSS rate : 16.57%
 *   IRPP (income tax)  : computed via progressive brackets
 *
 * Gross = Net / (1 - employeeCnss - irppRate)
 * Employer cost = Gross * (1 + employerCnss)
 *
 * For simplicity we use a flat effective IRPP rate of 15% for mid-range salaries.
 * This can be refined by integrating the full bracket table later.
 */
@Service
public class SimulationCalculationService {

    // Tunisian statutory rates
    private static final BigDecimal EMPLOYEE_CNSS = new BigDecimal("0.0918");
    private static final BigDecimal EMPLOYER_CNSS = new BigDecimal("0.1657");
    private static final BigDecimal FLAT_IRPP_RATE = new BigDecimal("0.15");

    // Default fallback values
    private static final BigDecimal DEFAULT_RECRUITMENT_MARGIN = new BigDecimal("10.00");
    private static final BigDecimal DEFAULT_INFRA_MARGIN = new BigDecimal("10.00");
    private static final BigDecimal DEFAULT_INFRA_COST_TND = new BigDecimal("500.00");
    private static final BigDecimal DEFAULT_EXCHANGE_RATE = new BigDecimal("0.45"); // ~1 TND ≈ 0.45 CAD

    private static final MathContext MC = new MathContext(12, RoundingMode.HALF_UP);
    private static final int SCALE = 2;

    private final ExchangeRateRepository exchangeRateRepository;
    private final MarginConfigRepository marginConfigRepository;
    private final ResourceRequestRepository resourceRequestRepository;

    public SimulationCalculationService(ExchangeRateRepository exchangeRateRepository,
                                        MarginConfigRepository marginConfigRepository,
                                        ResourceRequestRepository resourceRequestRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
        this.marginConfigRepository = marginConfigRepository;
        this.resourceRequestRepository = resourceRequestRepository;
    }

    public SimulationResultDto calculate(SimulationRequestDto input) {

        // Resolve parameters (use provided or fall back to defaults / DB)
        BigDecimal recruitmentMarginPct = resolve(input.getRecruitmentMarginPercent(), DEFAULT_RECRUITMENT_MARGIN);
        BigDecimal infraMarginPct = resolve(input.getInfrastructureMarginPercent(), DEFAULT_INFRA_MARGIN);
        BigDecimal infraCost = resolve(input.getFixedInfrastructureCostTnd(), DEFAULT_INFRA_COST_TND);
        BigDecimal rate = resolveExchangeRate(input.getExchangeRateTndToCad());

        int years = input.getDurationYears() != null ? input.getDurationYears() : 1;
        BigDecimal annualIncrease = resolve(input.getAnnualIncreasePercent(), BigDecimal.ZERO);

        BigDecimal currentNetSalary = input.getBaseNetSalaryTnd();

        List<SimulationYearDto> yearRows = new ArrayList<>();
        BigDecimal totalCadOverPeriod = BigDecimal.ZERO;

        for (int y = 1; y <= years; y++) {
            SimulationYearDto row = computeYear(y, currentNetSalary, infraCost,
                    recruitmentMarginPct, infraMarginPct, rate);
            yearRows.add(row);
            totalCadOverPeriod = totalCadOverPeriod.add(row.getFinalInvoicedCad().multiply(new BigDecimal("12")));

            // Apply annual increase for next year
            BigDecimal multiplier = BigDecimal.ONE.add(annualIncrease.divide(new BigDecimal("100"), MC));
            currentNetSalary = currentNetSalary.multiply(multiplier).setScale(SCALE, RoundingMode.HALF_UP);
        }

        BigDecimal avgMonthlyCad = years > 0
                ? totalCadOverPeriod.divide(new BigDecimal(years * 12), SCALE, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        SimulationResultDto result = new SimulationResultDto();
        result.setScenarioName(input.getScenarioName());
        result.setBaseNetSalaryTnd(input.getBaseNetSalaryTnd());
        result.setDurationYears(years);
        result.setAnnualIncreasePercent(annualIncrease);
        result.setRecruitmentMarginPercent(recruitmentMarginPct);
        result.setInfrastructureMarginPercent(infraMarginPct);
        result.setFixedInfrastructureCostTnd(infraCost);
        result.setExchangeRateTndToCad(rate);
        result.setYears(yearRows);
        result.setTotalCostOverPeriodCad(totalCadOverPeriod.setScale(SCALE, RoundingMode.HALF_UP));
        result.setAverageMonthlyCostCad(avgMonthlyCad);
        return result;
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private SimulationYearDto computeYear(int yearNum, BigDecimal netSalary, BigDecimal infraCost,
                                          BigDecimal recruitMarginPct, BigDecimal infraMarginPct,
                                          BigDecimal exchangeRate) {
        // Step 1: Net → Gross
        // Gross = Net / (1 - employeeCnss - irppRate)
        BigDecimal deductionRate = EMPLOYEE_CNSS.add(FLAT_IRPP_RATE);
        BigDecimal grossSalary = netSalary
                .divide(BigDecimal.ONE.subtract(deductionRate), MC)
                .setScale(SCALE, RoundingMode.HALF_UP);

        // Step 2: Gross → Employer cost
        BigDecimal employerCharges = grossSalary.multiply(EMPLOYER_CNSS).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal totalPayrollCost = grossSalary.add(employerCharges);

        // Step 3: Add infrastructure
        BigDecimal subTotal = totalPayrollCost.add(infraCost);

        // Step 4: Apply margins
        BigDecimal recruitMarginFactor = recruitMarginPct.divide(new BigDecimal("100"), MC);
        BigDecimal infraMarginFactor = infraMarginPct.divide(new BigDecimal("100"), MC);

        BigDecimal recruitMarginAmount = subTotal.multiply(recruitMarginFactor).setScale(SCALE, RoundingMode.HALF_UP);
        BigDecimal infraMarginAmount = subTotal.multiply(infraMarginFactor).setScale(SCALE, RoundingMode.HALF_UP);

        BigDecimal totalCostTnd = subTotal.add(recruitMarginAmount).add(infraMarginAmount);

        // Step 5: Convert to CAD (monthly)
        BigDecimal finalCad = totalCostTnd.multiply(exchangeRate).setScale(SCALE, RoundingMode.HALF_UP);

        SimulationYearDto row = new SimulationYearDto();
        row.setYear(yearNum);
        row.setNetSalaryTnd(netSalary);
        row.setGrossSalaryTnd(grossSalary);
        row.setEmployerChargesTnd(employerCharges);
        row.setTotalPayrollCostTnd(totalPayrollCost);
        row.setInfrastructureCostTnd(infraCost);
        row.setSubTotalBeforeMarginTnd(subTotal);
        row.setRecruitmentMarginAmountTnd(recruitMarginAmount);
        row.setInfrastructureMarginAmountTnd(infraMarginAmount);
        row.setTotalCostTnd(totalCostTnd.setScale(SCALE, RoundingMode.HALF_UP));
        row.setExchangeRateUsed(exchangeRate);
        row.setFinalInvoicedCad(finalCad);
        return row;
    }

    private BigDecimal resolve(BigDecimal provided, BigDecimal fallback) {
        return (provided != null) ? provided : fallback;
    }

    private BigDecimal resolveExchangeRate(BigDecimal provided) {
        if (provided != null) return provided;
        return exchangeRateRepository
                .findFirstByFromCurrencyAndToCurrencyAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
                        "TND", "CAD", LocalDate.now())
                .map(er -> er.getRate())
                .orElse(DEFAULT_EXCHANGE_RATE);
    }
}

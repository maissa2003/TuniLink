package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "simulation_year_projections")
@Getter
@Setter
@NoArgsConstructor
public class SimulationYearProjection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "simulation_id", nullable = false)
    private SalarySimulation simulation;

    @Column(name = "year_number", nullable = false)
    private Integer yearNumber; // 1, 2, 3...

    @Column(name = "net_salary", precision = 12, scale = 2)
    private BigDecimal netSalary;

    @Column(name = "gross_salary", precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "employer_charges", precision = 12, scale = 2)
    private BigDecimal employerCharges;

    @Column(name = "total_payroll_cost", precision = 12, scale = 2)
    private BigDecimal totalPayrollCost;

    @Column(name = "infrastructure_cost", precision = 12, scale = 2)
    private BigDecimal infrastructureCost;

    @Column(name = "recruitment_margin_amount", precision = 12, scale = 2)
    private BigDecimal recruitmentMarginAmount;

    @Column(name = "infrastructure_margin_amount", precision = 12, scale = 2)
    private BigDecimal infrastructureMarginAmount;

    @Column(name = "exchange_rate_used", precision = 12, scale = 6)
    private BigDecimal exchangeRateUsed;

    @Column(name = "converted_amount_cad", precision = 12, scale = 2)
    private BigDecimal convertedAmountCad;

    @Column(name = "final_invoiced_amount", precision = 12, scale = 2)
    private BigDecimal finalInvoicedAmount;
}
package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Persisted payroll calculation for a specific employee and month.
 * Created and validated by Finance. HR and Infrastructure data is read-only here.
 */
@Entity
@Table(name = "payroll_records",
        uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "period_month"}))
@Getter
@Setter
@NoArgsConstructor
public class PayrollRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private EmployeeContract contract;

    /** First day of the payroll month */
    @Column(name = "period_month", nullable = false)
    private LocalDate periodMonth;

    // ── Employee-side payslip ──────────────────────────
    @Column(name = "gross_salary", precision = 12, scale = 2)
    private BigDecimal grossSalary;

    @Column(name = "employee_cnss", precision = 12, scale = 2)
    private BigDecimal employeeCnss;

    @Column(name = "irpp_tax", precision = 12, scale = 2)
    private BigDecimal irppTax;

    @Column(name = "bonus", precision = 12, scale = 2)
    private BigDecimal bonus;

    @Column(name = "net_salary", precision = 12, scale = 2)
    private BigDecimal netSalary;

    // ── Employer cost ──────────────────────────────────
    @Column(name = "employer_cnss", precision = 12, scale = 2)
    private BigDecimal employerCnss;

    @Column(name = "infra_cost_total", precision = 12, scale = 2)
    private BigDecimal infraCostTotal;

    @Column(name = "recruitment_margin", precision = 12, scale = 2)
    private BigDecimal recruitmentMargin;

    @Column(name = "infra_margin", precision = 12, scale = 2)
    private BigDecimal infraMargin;

    @Column(name = "total_employer_cost_tnd", precision = 12, scale = 2)
    private BigDecimal totalEmployerCostTnd;

    @Column(name = "final_invoice_cad", precision = 12, scale = 2)
    private BigDecimal finalInvoiceCad;

    @Column(name = "exchange_rate_used", precision = 10, scale = 6)
    private BigDecimal exchangeRateUsed;

    // ── Validation ─────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PayrollStatus status = PayrollStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validated_by_user_id")
    private User validatedBy;

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

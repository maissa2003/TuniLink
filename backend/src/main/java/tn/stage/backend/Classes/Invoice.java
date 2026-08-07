package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a monthly invoice sent to the Canadian client.
 * Generated automatically by Finance once payroll is validated.
 */
@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @Column(name = "invoice_number", unique = true, nullable = false)
    private String invoiceNumber;

    /** First day of the billing month, e.g. 2025-01-01 for January */
    @Column(name = "period_month", nullable = false)
    private LocalDate periodMonth;

    /** Total employer cost in TND */
    @Column(name = "gross_amount_tnd", precision = 12, scale = 2, nullable = false)
    private BigDecimal grossAmountTnd;

    /** Final billed amount converted to CAD */
    @Column(name = "net_amount_cad", precision = 12, scale = 2, nullable = false)
    private BigDecimal netAmountCad;

    @Column(name = "exchange_rate_used", precision = 10, scale = 6)
    private BigDecimal exchangeRateUsed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by_user_id")
    private User generatedBy;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
    }
}

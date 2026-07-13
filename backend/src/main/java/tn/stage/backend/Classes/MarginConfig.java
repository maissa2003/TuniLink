package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "margin_configs")
@Getter
@Setter
@NoArgsConstructor
public class MarginConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "margin_percent", precision = 5, scale = 2, nullable = false)
    private BigDecimal marginPercent; // ex: 10.00 pour 10%

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo; // null = toujours actif

    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;
}
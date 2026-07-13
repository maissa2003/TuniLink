package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "discount_rules")
@Getter
@Setter
@NoArgsConstructor
public class DiscountRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_company_id", nullable = false)
    private Company clientCompany;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type", nullable = false)
    private DiscountConditionType conditionType;

    @Column(name = "threshold_value", precision = 10, scale = 2)
    private BigDecimal thresholdValue; // ex: 4 (années), 10 (employés)

    @Column(name = "discount_percent", precision = 5, scale = 2, nullable = false)
    private BigDecimal discountPercent;

    private String description;

    private boolean active = true;
}
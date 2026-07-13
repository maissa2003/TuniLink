package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "infrastructure_costs")
@Getter
@Setter
@NoArgsConstructor
public class InfrastructureCost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company; // toujours de type INFRASTRUCTURE_PROVIDER

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InfrastructureCostCategory category;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "cost_month", nullable = false)
    private LocalDate costMonth;
}
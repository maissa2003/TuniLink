package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salary_simulations")
@Getter
@Setter
@NoArgsConstructor
public class SalarySimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id") // Nullable car la simulation peut être faite avant l'embauche
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "resource_request_id")
    private ResourceRequest resourceRequest;

    @Column(nullable = false)
    private String name; // ex: "Scénario A - hausse 5%/an"

    @Column(name = "base_net_salary", precision = 12, scale = 2, nullable = false)
    private BigDecimal baseNetSalary;

    @Column(name = "base_year", nullable = false)
    private Integer baseYear;

    @Column(name = "duration_years", nullable = false)
    private Integer durationYears;

    @Column(name = "annual_increase_percent", precision = 5, scale = 2)
    private BigDecimal annualIncreasePercent; // hausse simple; on peut affiner par année si besoin

    @ManyToOne
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "simulation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SimulationYearProjection> projections = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
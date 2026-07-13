package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyType type;

    private String country;

    private String currency; // ex: "TND", "CAD"

    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();

    @OneToMany(mappedBy = "company")
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "clientCompany")
    private List<Assignment> clientAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "infrastructureCompany")
    private List<Assignment> infrastructureAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "recruitmentCompany")
    private List<Assignment> recruitmentAssignments = new ArrayList<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MarginConfig> marginConfigs = new ArrayList<>();
}
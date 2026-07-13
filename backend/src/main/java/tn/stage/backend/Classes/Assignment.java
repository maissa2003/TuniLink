package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "assignments")
@Getter
@Setter
@NoArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "client_company_id", nullable = false)
    private Company clientCompany; // le client canadien

    @ManyToOne
    @JoinColumn(name = "infrastructure_company_id", nullable = false)
    private Company infrastructureCompany; // 1ère entreprise

    @ManyToOne
    @JoinColumn(name = "recruitment_company_id", nullable = false)
    private Company recruitmentCompany; // 2ème entreprise

    @Enumerated(EnumType.STRING)
    private AssignmentStatus status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
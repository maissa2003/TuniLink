package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.SalarySimulation;

import java.util.List;

public interface SalarySimulationRepository extends JpaRepository<SalarySimulation, Long> {

    List<SalarySimulation> findByAssignmentId(Long assignmentId);

    List<SalarySimulation> findByCreatedByIdOrderByCreatedAtDesc(Long userId);
}
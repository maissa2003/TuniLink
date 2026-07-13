package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.SimulationYearProjection;

import java.util.List;

public interface SimulationYearProjectionRepository extends JpaRepository<SimulationYearProjection, Long> {

    List<SimulationYearProjection> findBySimulationIdOrderByYearNumberAsc(Long simulationId);
}
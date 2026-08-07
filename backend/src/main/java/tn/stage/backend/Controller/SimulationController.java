package tn.stage.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.DTO.SimulationRequestDto;
import tn.stage.backend.DTO.SimulationResultDto;
import tn.stage.backend.Service.SimulationCalculationService;

import java.util.Map;

@RestController
@RequestMapping("/api/simulations")
public class SimulationController {

    private final SimulationCalculationService calculationService;

    public SimulationController(SimulationCalculationService calculationService) {
        this.calculationService = calculationService;
    }

    /**
     * POST /api/simulations/calculate
     * Stateless: takes inputs, returns the full projection immediately.
     * No authentication required beyond being logged in (authenticated()).
     */
    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@RequestBody SimulationRequestDto dto) {
        try {
            SimulationResultDto result = calculationService.calculate(dto);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

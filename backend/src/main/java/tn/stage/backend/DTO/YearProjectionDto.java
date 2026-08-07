package tn.stage.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class YearProjectionDto {
    private int year;
    private BigDecimal totalCostTnd;
    private BigDecimal totalBilledCad;
}

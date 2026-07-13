package tn.stage.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.math.BigDecimal;

@Getter @AllArgsConstructor
public class CompanySummary {
    private Long id;
    private String name;
    private String type;
    private String country;
    private String currency;
    private BigDecimal taxRate;
}
package tn.stage.backend.DTO;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter @Setter
public class CompanyRequest {
    private String name;
    private String type;
    private String country;
    private String currency;
    private BigDecimal taxRate;
}
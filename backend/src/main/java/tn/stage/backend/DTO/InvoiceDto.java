package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.InvoiceStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InvoiceDto {
    private Long id;
    private Long assignmentId;
    private String employeeName;
    private String clientCompanyName;
    private String invoiceNumber;
    private LocalDate periodMonth;
    private BigDecimal grossAmountTnd;
    private BigDecimal netAmountCad;
    private BigDecimal exchangeRateUsed;
    private InvoiceStatus status;
    private String generatedByName;
    private LocalDateTime generatedAt;
}

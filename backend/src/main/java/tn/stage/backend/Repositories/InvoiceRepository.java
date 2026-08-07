package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.Invoice;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByAssignmentIdOrderByPeriodMonthDesc(Long assignmentId);
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
}

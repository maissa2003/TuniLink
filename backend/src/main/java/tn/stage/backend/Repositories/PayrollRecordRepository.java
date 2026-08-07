package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.PayrollRecord;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, Long> {
    List<PayrollRecord> findByEmployeeIdOrderByPeriodMonthDesc(Long employeeId);
    Optional<PayrollRecord> findByEmployeeIdAndPeriodMonth(Long employeeId, LocalDate periodMonth);
    List<PayrollRecord> findByContractId(Long contractId);
}

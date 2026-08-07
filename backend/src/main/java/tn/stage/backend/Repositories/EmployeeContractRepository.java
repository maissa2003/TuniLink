package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.ContractStatus;
import tn.stage.backend.Classes.EmployeeContract;

import java.util.List;
import java.util.Optional;

public interface EmployeeContractRepository extends JpaRepository<EmployeeContract, Long> {
    List<EmployeeContract> findByEmployeeId(Long employeeId);
    Optional<EmployeeContract> findFirstByEmployeeIdAndStatusOrderByCreatedAtDesc(Long employeeId, ContractStatus status);
    List<EmployeeContract> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
}

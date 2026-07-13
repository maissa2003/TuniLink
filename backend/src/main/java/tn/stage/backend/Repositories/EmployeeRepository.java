package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.Employee;
import tn.stage.backend.Classes.EmployeeStatus;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeNumber(String employeeNumber);

    List<Employee> findByCompanyId(Long companyId);

    List<Employee> findByStatus(EmployeeStatus status);

    Optional<Employee> findByUserId(Long userId);
}
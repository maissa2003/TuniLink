package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.Assignment;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByEmployeeId(Long employeeId);

    List<Assignment> findByClientCompanyId(Long clientCompanyId);

    List<Assignment> findByInfrastructureCompanyId(Long infrastructureCompanyId);
}

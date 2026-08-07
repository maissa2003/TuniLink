package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.InfrastructureCost;

import java.util.List;

public interface InfrastructureCostRepository extends JpaRepository<InfrastructureCost, Long> {

    List<InfrastructureCost> findByCompanyId(Long companyId);

    List<InfrastructureCost> findByEmployeeId(Long employeeId);
}
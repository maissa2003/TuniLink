package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.ApprovalStatus;
import tn.stage.backend.Classes.Variation;

import java.util.List;

public interface VariationRepository extends JpaRepository<Variation, Long> {

    List<Variation> findByEmployeeId(Long employeeId);

    List<Variation> findByApprovalStatus(ApprovalStatus approvalStatus);
}

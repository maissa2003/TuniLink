package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.DiscountRule;

import java.util.List;

public interface DiscountRuleRepository extends JpaRepository<DiscountRule, Long> {

    List<DiscountRule> findByClientCompanyIdAndActiveTrue(Long clientCompanyId);
}
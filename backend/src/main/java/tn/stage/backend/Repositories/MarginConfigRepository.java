package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.MarginConfig;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MarginConfigRepository extends JpaRepository<MarginConfig, Long> {

    List<MarginConfig> findByCompanyIdOrderByEffectiveFromDesc(Long companyId);

    // Renvoie la marge active à une date donnée pour une entreprise
    Optional<MarginConfig> findFirstByCompanyIdAndEffectiveFromLessThanEqualAndEffectiveToIsNullOrEffectiveToGreaterThanEqualOrderByEffectiveFromDesc(
            Long companyId, LocalDate date1, LocalDate date2);
}
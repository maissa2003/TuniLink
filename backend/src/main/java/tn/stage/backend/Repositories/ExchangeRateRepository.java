package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.ExchangeRate;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {

    List<ExchangeRate> findByFromCurrencyAndToCurrencyOrderByEffectiveDateDesc(String from, String to);

    // Le taux applicable à une date donnée (le plus récent avant ou égal à cette date)
    Optional<ExchangeRate> findFirstByFromCurrencyAndToCurrencyAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(
            String from, String to, LocalDate date);
}
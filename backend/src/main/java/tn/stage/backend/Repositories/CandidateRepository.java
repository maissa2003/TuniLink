package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.Candidate;
import tn.stage.backend.Classes.CandidateStatus;

import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    List<Candidate> findByStatusOrderByCreatedAtDesc(CandidateStatus status);

    List<Candidate> findAllByOrderByCreatedAtDesc();

    List<Candidate> findByResourceRequestIdOrderByCreatedAtDesc(Long requestId);

    Optional<Candidate> findByEmail(String email);
}

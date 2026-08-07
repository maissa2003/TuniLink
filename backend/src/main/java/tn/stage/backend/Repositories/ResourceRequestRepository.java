package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.stage.backend.Classes.Company;
import tn.stage.backend.Classes.ResourceRequest;

import java.util.List;

@Repository
public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, Long> {
    List<ResourceRequest> findByClientCompany(Company clientCompany);
    List<ResourceRequest> findByClientCompanyId(Long clientCompanyId);
}

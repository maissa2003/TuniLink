package tn.stage.backend.Controller;

import tn.stage.backend.Classes.Company;
import tn.stage.backend.Classes.CompanyType;
import tn.stage.backend.DTO.CompanyRequest;
import tn.stage.backend.DTO.CompanySummary;
import tn.stage.backend.Repositories.CompanyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @GetMapping
    public List<CompanySummary> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(c -> new CompanySummary(c.getId(), c.getName(), c.getType().name(), c.getCountry(), c.getCurrency(), c.getTaxRate()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createCompany(@RequestBody CompanyRequest request) {
        CompanyType type;
        try {
            type = CompanyType.valueOf(request.getType());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Type d'entreprise invalide."));
        }

        Company company = new Company();
        company.setName(request.getName());
        company.setType(type);
        company.setCountry(request.getCountry());
        company.setCurrency(request.getCurrency());
        company.setTaxRate(request.getTaxRate());

        companyRepository.save(company);
        return ResponseEntity.ok(Map.of("message", "Entreprise créée.", "id", company.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody CompanyRequest request) {
        Company company = companyRepository.findById(id).orElse(null);
        if (company == null) {
            return ResponseEntity.notFound().build();
        }

        CompanyType type;
        try {
            type = CompanyType.valueOf(request.getType());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Type d'entreprise invalide."));
        }

        company.setName(request.getName());
        company.setType(type);
        company.setCountry(request.getCountry());
        company.setCurrency(request.getCurrency());
        company.setTaxRate(request.getTaxRate());

        companyRepository.save(company);
        return ResponseEntity.ok(Map.of("message", "Entreprise mise à jour."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        if (!companyRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        companyRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Entreprise supprimée."));
    }
}
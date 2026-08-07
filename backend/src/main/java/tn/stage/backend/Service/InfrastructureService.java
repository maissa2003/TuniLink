package tn.stage.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.stage.backend.Classes.*;
import tn.stage.backend.DTO.CreateInfrastructureCostDto;
import tn.stage.backend.DTO.InfrastructureCostDto;
import tn.stage.backend.Repositories.EmployeeEventRepository;
import tn.stage.backend.Repositories.EmployeeRepository;
import tn.stage.backend.Repositories.InfrastructureCostRepository;
import tn.stage.backend.Repositories.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InfrastructureService {

    private final InfrastructureCostRepository infraRepo;
    private final EmployeeRepository employeeRepo;
    private final UserRepository userRepo;
    private final EmployeeEventRepository eventRepo;

    /** Infrastructure dept assigns a resource — advances status to INFRASTRUCTURE_ASSIGNED */
    @Transactional
    public InfrastructureCostDto addCost(Long employeeId, CreateInfrastructureCostDto dto, String infraUserEmail) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));

        User infraUser = userRepo.findByEmail(infraUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + infraUserEmail));

        InfrastructureCost cost = new InfrastructureCost();
        cost.setEmployee(employee);
        cost.setCompany(infraUser.getCompany());
        cost.setCategory(dto.getCategory());
        cost.setResourceName(dto.getResourceName());
        cost.setDescription(dto.getDescription());
        cost.setAssignmentDate(dto.getAssignmentDate() != null ? dto.getAssignmentDate() : LocalDate.now());
        cost.setAssignedBy(infraUser);
        cost.setAmount(dto.getAmount());
        
        InfrastructureCost saved = infraRepo.save(cost);

        // Advance status when infrastructure has been assigned
        if (employee.getStatus() == EmployeeStatus.CONTRACT_CREATED) {
            employee.setStatus(EmployeeStatus.INFRASTRUCTURE_ASSIGNED);
            employeeRepo.save(employee);
        }
        
        // Fire event
        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(employee);
        event.setEventType("RESOURCE_ASSIGNED");
        event.setDescription("Infrastructure assigned resource: " + (dto.getResourceName() != null ? dto.getResourceName() : dto.getCategory()));
        event.setPerformedBy(infraUser);
        eventRepo.save(event);

        return mapToDto(saved);
    }

    public List<InfrastructureCostDto> getCostsByEmployee(Long employeeId) {
        return infraRepo.findByEmployeeId(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public InfrastructureCostDto updateCost(Long costId, CreateInfrastructureCostDto dto) {
        InfrastructureCost cost = infraRepo.findById(costId)
                .orElseThrow(() -> new IllegalArgumentException("Cost entry not found: " + costId));
        if (dto.getCategory() != null) cost.setCategory(dto.getCategory());
        if (dto.getAmount() != null) cost.setAmount(dto.getAmount());
        if (dto.getResourceName() != null) cost.setResourceName(dto.getResourceName());
        if (dto.getDescription() != null) cost.setDescription(dto.getDescription());
        if (dto.getAssignmentDate() != null) cost.setAssignmentDate(dto.getAssignmentDate());
        return mapToDto(infraRepo.save(cost));
    }

    @Transactional
    public void deleteCost(Long costId) {
        infraRepo.deleteById(costId);
    }

    public BigDecimal getTotalMonthlyCost(Long employeeId) {
        return infraRepo.findByEmployeeId(employeeId).stream()
                .map(InfrastructureCost::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Infrastructure dept signals "all resources assigned — ready for Finance".
     * Advances the employee status to INFRASTRUCTURE_ASSIGNED regardless of how
     * many resources were previously added (addCost already sets it on the first add,
     * but this explicit action is the formal workflow handoff).
     */
    @Transactional
    public void completeAssignment(Long employeeId, String infraUserEmail) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));
        User infraUser = userRepo.findByEmail(infraUserEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + infraUserEmail));

        // Enforce that infrastructure can only complete from CONTRACT_CREATED or INFRASTRUCTURE_ASSIGNED
        if (employee.getStatus() != EmployeeStatus.CONTRACT_CREATED
                && employee.getStatus() != EmployeeStatus.INFRASTRUCTURE_ASSIGNED) {
            throw new IllegalStateException(
                "Cannot complete infrastructure for employee in status: " + employee.getStatus());
        }

        employee.setStatus(EmployeeStatus.INFRASTRUCTURE_ASSIGNED);
        employeeRepo.save(employee);

        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(employee);
        event.setEventType("INFRASTRUCTURE_COMPLETE");
        event.setDescription("Infrastructure dept completed resource allocation — ready for Finance validation");
        event.setPerformedBy(infraUser);
        eventRepo.save(event);
    }

    private InfrastructureCostDto mapToDto(InfrastructureCost c) {
        InfrastructureCostDto dto = new InfrastructureCostDto();
        dto.setId(c.getId());
        dto.setEmployeeId(c.getEmployee().getId());
        dto.setEmployeeName(c.getEmployee().getFullName());
        dto.setCategory(c.getCategory());
        dto.setAmount(c.getAmount());
        dto.setResourceName(c.getResourceName());
        dto.setDescription(c.getDescription());
        dto.setAssignmentDate(c.getAssignmentDate());
        if (c.getAssignedBy() != null) {
            dto.setAssignedByName(c.getAssignedBy().getUsername());
        }
        if (c.getCompany() != null) dto.setCompanyName(c.getCompany().getName());
        return dto;
    }
}

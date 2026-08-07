package tn.stage.backend.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.stage.backend.Classes.*;
import tn.stage.backend.DTO.CreateContractDto;
import tn.stage.backend.DTO.EmployeeContractDto;
import tn.stage.backend.Repositories.EmployeeContractRepository;
import tn.stage.backend.Repositories.EmployeeRepository;
import tn.stage.backend.Repositories.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeContractService {

    private final EmployeeContractRepository contractRepo;
    private final EmployeeRepository employeeRepo;
    private final UserRepository userRepo;
    private final tn.stage.backend.Repositories.EmployeeEventRepository eventRepo;

    /** HR creates a contract — advances employee status to CONTRACT_CREATED */
    @Transactional
    public EmployeeContractDto createContract(Long employeeId, CreateContractDto dto, String hrEmail) {
        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + employeeId));
        User createdBy = userRepo.findByEmail(hrEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + hrEmail));

        // Terminate any previously active contract
        contractRepo.findFirstByEmployeeIdAndStatusOrderByCreatedAtDesc(employeeId, ContractStatus.ACTIVE)
                .ifPresent(old -> {
                    old.setStatus(ContractStatus.TERMINATED);
                    contractRepo.save(old);
                });

        EmployeeContract contract = new EmployeeContract();
        contract.setEmployee(employee);
        contract.setContractType(dto.getContractType());
        contract.setPosition(dto.getPosition());
        contract.setStartDate(dto.getStartDate());
        contract.setEndDate(dto.getEndDate());
        contract.setGrossSalary(dto.getGrossSalary());
        contract.setBonus(dto.getBonus() != null ? dto.getBonus() : java.math.BigDecimal.ZERO);
        contract.setStatus(ContractStatus.ACTIVE);
        contract.setCreatedBy(createdBy);

        EmployeeContract saved = contractRepo.save(contract);

        // Advance employee workflow status
        if (employee.getStatus() == EmployeeStatus.RECRUITED ||
            employee.getStatus() == null) {
            employee.setStatus(EmployeeStatus.CONTRACT_CREATED);
            employeeRepo.save(employee);
        }

        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(employee);
        event.setEventType("CONTRACT_CREATED");
        event.setDescription("HR created employment contract: " + dto.getContractType() + ", " + dto.getGrossSalary() + " TND gross");
        event.setPerformedBy(createdBy);
        eventRepo.save(event);

        return mapToDto(saved);
    }

    /** HR updates an existing contract */
    @Transactional
    public EmployeeContractDto updateContract(Long contractId, CreateContractDto dto, String hrEmail) {
        EmployeeContract contract = contractRepo.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found: " + contractId));

        contract.setContractType(dto.getContractType());
        contract.setPosition(dto.getPosition());
        contract.setStartDate(dto.getStartDate());
        contract.setEndDate(dto.getEndDate());
        contract.setGrossSalary(dto.getGrossSalary());
        if (dto.getBonus() != null) contract.setBonus(dto.getBonus());

        EmployeeContract saved = contractRepo.save(contract);
        
        User createdBy = userRepo.findByEmail(hrEmail).orElse(null);
        EmployeeEvent event = new EmployeeEvent();
        event.setEmployee(contract.getEmployee());
        event.setEventType("CONTRACT_UPDATED");
        event.setDescription("HR updated employment contract: " + dto.getContractType() + ", " + dto.getGrossSalary() + " TND gross");
        event.setPerformedBy(createdBy);
        eventRepo.save(event);

        return mapToDto(saved);
    }

    public List<EmployeeContractDto> getContractsByEmployee(Long employeeId) {
        return contractRepo.findByEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public EmployeeContractDto getActiveContract(Long employeeId) {
        return contractRepo.findFirstByEmployeeIdAndStatusOrderByCreatedAtDesc(employeeId, ContractStatus.ACTIVE)
                .map(this::mapToDto)
                .orElseThrow(() -> new IllegalArgumentException("No active contract for employee: " + employeeId));
    }

    private EmployeeContractDto mapToDto(EmployeeContract c) {
        EmployeeContractDto dto = new EmployeeContractDto();
        dto.setId(c.getId());
        dto.setEmployeeId(c.getEmployee().getId());
        dto.setEmployeeName(c.getEmployee().getFullName());
        dto.setContractType(c.getContractType());
        dto.setPosition(c.getPosition());
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());
        dto.setGrossSalary(c.getGrossSalary());
        dto.setBonus(c.getBonus());
        dto.setStatus(c.getStatus());
        if (c.getCreatedBy() != null) dto.setCreatedByName(c.getCreatedBy().getUsername());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }
}

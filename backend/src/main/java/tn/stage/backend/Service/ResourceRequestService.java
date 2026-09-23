package tn.stage.backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.stage.backend.Classes.Assignment;
import tn.stage.backend.Classes.Company;
import tn.stage.backend.Classes.RequestStatus;
import tn.stage.backend.Classes.ResourceRequest;
import tn.stage.backend.Classes.User;
import tn.stage.backend.DTO.CreateResourceRequestDto;
import tn.stage.backend.DTO.ResourceRequestDto;
import tn.stage.backend.DTO.UpdateResourceRequestStatusDto;
import tn.stage.backend.Repositories.AssignmentRepository;
import tn.stage.backend.Repositories.CompanyRepository;
import tn.stage.backend.Repositories.ResourceRequestRepository;
import tn.stage.backend.Repositories.UserRepository;
import tn.stage.backend.DTO.SimulationResultDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceRequestService {

    private final ResourceRequestRepository resourceRequestRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final AssignmentRepository assignmentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResourceRequestService(ResourceRequestRepository resourceRequestRepository,
                                  UserRepository userRepository,
                                  CompanyRepository companyRepository,
                                  AssignmentRepository assignmentRepository) {
        this.resourceRequestRepository = resourceRequestRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<ResourceRequestDto> getAllRequests() {
        return resourceRequestRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ResourceRequestDto> getRequestsByClient(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé: " + email));
        if (user.getCompany() == null) {
            throw new IllegalArgumentException("L'utilisateur n'est pas associé à une entreprise.");
        }
        return resourceRequestRepository.findByClientCompany(user.getCompany())
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public ResourceRequestDto createRequest(String email, CreateResourceRequestDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé: " + email));
        if (user.getCompany() == null) {
            throw new IllegalArgumentException("L'utilisateur n'est pas associé à une entreprise.");
        }

        ResourceRequest request = new ResourceRequest();
        request.setClientCompany(user.getCompany());
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setTargetDate(dto.getTargetDate());
        request.setSeniorityLevel(dto.getSeniorityLevel());
        request.setWorkMode(dto.getWorkMode());
        request.setRequiredSkills(dto.getRequiredSkills());
        request.setEstimatedBudgetCad(dto.getEstimatedBudgetCad());
        request.setAnnualRaisePercent(dto.getAnnualRaisePercent());
        request.setStatus(RequestStatus.PENDING);

        ResourceRequest saved = resourceRequestRepository.save(request);
        return mapToDto(saved);
    }

    @Transactional
    public ResourceRequestDto updateRequestStatus(Long id, UpdateResourceRequestStatusDto dto) {
        ResourceRequest request = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée."));
        
        if (dto.getStatus() != null) {
            request.setStatus(dto.getStatus());
        }
        
        if (dto.getAssignmentId() != null) {
            Assignment assignment = assignmentRepository.findById(dto.getAssignmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Affectation non trouvée."));
            request.setAssignment(assignment);
            request.setStatus(RequestStatus.FULFILLED);
        }

        ResourceRequest updated = resourceRequestRepository.save(request);
        return mapToDto(updated);
    }

    @Transactional
    public ResourceRequestDto saveSimulationDetails(Long id, SimulationResultDto resultDto) {
        ResourceRequest request = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée."));
        
        try {
            String json = objectMapper.writeValueAsString(resultDto);
            request.setSimulationDetails(json);
            request.setStatus(RequestStatus.SIMULATION_PENDING);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize simulation details", e);
        }
        
        ResourceRequest updated = resourceRequestRepository.save(request);
        return mapToDto(updated);
    }

    @Transactional
    public ResourceRequestDto approveSimulation(Long id) {
        ResourceRequest request = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée."));
        
        request.setStatus(RequestStatus.FULFILLED);
        ResourceRequest updated = resourceRequestRepository.save(request);
        return mapToDto(updated);
    }

    @Transactional
    public ResourceRequestDto rejectSimulation(Long id, String reason) {
        ResourceRequest request = resourceRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Demande non trouvée."));
        
        request.setStatus(RequestStatus.IN_PROGRESS);
        request.setRejectionReason(reason);
        ResourceRequest updated = resourceRequestRepository.save(request);
        return mapToDto(updated);
    }

    private ResourceRequestDto mapToDto(ResourceRequest request) {
        ResourceRequestDto dto = new ResourceRequestDto();
        dto.setId(request.getId());
        if (request.getClientCompany() != null) {
            dto.setClientCompanyId(request.getClientCompany().getId());
            dto.setClientCompanyName(request.getClientCompany().getName());
        }
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setTargetDate(request.getTargetDate());
        dto.setSeniorityLevel(request.getSeniorityLevel());
        dto.setWorkMode(request.getWorkMode());
        dto.setRequiredSkills(request.getRequiredSkills());
        dto.setEstimatedBudgetCad(request.getEstimatedBudgetCad());
        dto.setAnnualRaisePercent(request.getAnnualRaisePercent());
        dto.setSimulationDetails(request.getSimulationDetails());
        dto.setRejectionReason(request.getRejectionReason());
        dto.setStatus(request.getStatus());
        if (request.getAssignment() != null) {
            dto.setAssignmentId(request.getAssignment().getId());
        }
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        return dto;
    }
}

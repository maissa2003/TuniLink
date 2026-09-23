package tn.stage.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.stage.backend.Classes.EmployeeEvent;
import tn.stage.backend.DTO.EmployeeEventDto;
import tn.stage.backend.Repositories.EmployeeEventRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EmployeeEventController {

    private final EmployeeEventRepository eventRepository;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmployeeEventDto>> getEmployeeEvents(@PathVariable Long employeeId) {
        List<EmployeeEventDto> events = eventRepository.findByEmployeeIdOrderByOccurredAtDesc(employeeId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    private EmployeeEventDto mapToDto(EmployeeEvent event) {
        EmployeeEventDto dto = new EmployeeEventDto();
        dto.setId(event.getId());
        dto.setEventType(event.getEventType());
        dto.setDescription(event.getDescription());
        if (event.getPerformedBy() != null) {
            dto.setPerformedByName(event.getPerformedBy().getUsername());
        }
        dto.setOccurredAt(event.getOccurredAt());
        return dto;
    }
}

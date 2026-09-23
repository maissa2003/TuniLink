package tn.stage.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.stage.backend.Classes.EmployeeEvent;

import java.util.List;

public interface EmployeeEventRepository extends JpaRepository<EmployeeEvent, Long> {
    List<EmployeeEvent> findByEmployeeIdOrderByOccurredAtDesc(Long employeeId);
}

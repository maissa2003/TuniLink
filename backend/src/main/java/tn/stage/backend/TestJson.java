package tn.stage.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import tn.stage.backend.Classes.LeaveRequest;
import java.time.LocalDate;

public class TestJson {
    public static void main(String[] args) throws Exception {
        LeaveRequest req = new LeaveRequest();
        req.setId(1L);
        req.setType(LeaveRequest.LeaveType.ANNUAL);
        req.setStartDate(LocalDate.now());
        req.setEndDate(LocalDate.now().plusDays(5));
        req.setDays(5);
        req.setStatus(LeaveRequest.LeaveStatus.PENDING);
        
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules(); // For LocalDate
        System.out.println(mapper.writeValueAsString(req));
    }
}

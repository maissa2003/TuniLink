package tn.stage.backend.DTO;

import lombok.Data;
import tn.stage.backend.Classes.RequestStatus;

@Data
public class UpdateResourceRequestStatusDto {
    private RequestStatus status;
    private Long assignmentId;
}

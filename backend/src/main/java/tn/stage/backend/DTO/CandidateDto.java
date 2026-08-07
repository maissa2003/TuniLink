package tn.stage.backend.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tn.stage.backend.Classes.CandidateStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CandidateDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String linkedinUrl;

    // CV metadata only — never expose full server path to frontend
    private String cvOriginalFilename;
    private LocalDateTime cvUploadedAt;
    private boolean hasCv;

    private String skills;
    private Integer yearsOfExperience;
    private BigDecimal expectedSalary;
    private LocalDate availabilityDate;

    private CandidateStatus status;
    private String rejectionReason;

    private Long resourceRequestId;
    private String resourceRequestTitle;

    private Long convertedEmployeeId;
    private String reviewedByName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

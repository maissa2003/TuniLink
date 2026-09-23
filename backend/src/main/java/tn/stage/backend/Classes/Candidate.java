package tn.stage.backend.Classes;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    // ── CV Storage (local path now, swappable for cloud URL later) ──
    @Column(name = "cv_file_path")
    private String cvFilePath;          // absolute path on disk

    @Column(name = "cv_original_filename")
    private String cvOriginalFilename;  // original name shown to HR

    @Column(name = "cv_uploaded_at")
    private LocalDateTime cvUploadedAt;

    // ── Professional info ──
    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "expected_salary", precision = 12, scale = 2)
    private BigDecimal expectedSalary;

    @Column(name = "availability_date")
    private LocalDate availabilityDate;

    // ── Workflow ──
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CandidateStatus status = CandidateStatus.NEW_APPLICATION;

    /**
     * Which client hiring request this candidate was matched to.
     * Null until HR decides to link this candidate to a request.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_request_id")
    private ResourceRequest resourceRequest;

    /**
     * Populated when HR clicks "Hire". Points to the Employee record created
     * from this candidate. One candidate can only be hired once.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "converted_employee_id")
    private Employee convertedEmployee;

    /** HR user who reviewed / hired this candidate */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_user_id")
    private User reviewedBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    /** Convenience: full name for display */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}

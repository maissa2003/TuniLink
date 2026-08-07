package tn.stage.backend.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.stage.backend.DTO.CandidateDto;
import tn.stage.backend.Service.CandidateService;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;

    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC ENDPOINTS — no JWT required (Landing Page apply form)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * POST /api/public/candidates/apply
     * A job seeker submits their application from the public Landing Page.
     * Accepts multipart/form-data to handle CV file upload.
     */
    @PostMapping(value = "/api/public/candidates/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> applyPublic(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "linkedinUrl", required = false) String linkedinUrl,
            @RequestParam(value = "skills", required = false) String skills,
            @RequestParam(value = "yearsOfExperience", required = false) Integer yearsOfExperience,
            @RequestParam(value = "expectedSalary", required = false) String expectedSalary,
            @RequestParam(value = "availabilityDate", required = false) String availabilityDate,
            @RequestParam(value = "cvFile", required = false) MultipartFile cvFile) {
        try {
            CandidateDto result = candidateService.applyPublic(
                    firstName, lastName, email, phone, linkedinUrl,
                    skills, yearsOfExperience, expectedSalary, availabilityDate, cvFile);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to submit application. Please try again."));
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // HR ENDPOINTS — require authentication
    // ═══════════════════════════════════════════════════════════════════════════

    /** GET /api/candidates — list all candidates (HR / MANAGER) */
    @GetMapping("/api/candidates")
    public ResponseEntity<List<CandidateDto>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    /** GET /api/candidates/{id} — candidate detail */
    @GetMapping("/api/candidates/{id}")
    public ResponseEntity<?> getCandidate(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(candidateService.getCandidateById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** PUT /api/candidates/{id}/review — mark as under review */
    @PutMapping("/api/candidates/{id}/review")
    public ResponseEntity<?> markUnderReview(@PathVariable Long id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        return ResponseEntity.ok(candidateService.markUnderReview(id, auth.getName()));
    }

    /** PUT /api/candidates/{id}/interview — schedule interview */
    @PutMapping("/api/candidates/{id}/interview")
    public ResponseEntity<?> scheduleInterview(@PathVariable Long id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        return ResponseEntity.ok(candidateService.scheduleInterview(id, auth.getName()));
    }

    /** PUT /api/candidates/{id}/reject — reject with reason */
    @PutMapping("/api/candidates/{id}/reject")
    public ResponseEntity<?> rejectCandidate(@PathVariable Long id,
                                              @RequestBody Map<String, String> body,
                                              Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            String reason = body.getOrDefault("reason", "");
            return ResponseEntity.ok(candidateService.rejectCandidate(id, reason, auth.getName()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * POST /api/candidates/{id}/hire
     * The pivotal HR action — converts candidate into employee.
     * Body: { "resourceRequestId": 123 }
     */
    @PostMapping("/api/candidates/{id}/hire")
    public ResponseEntity<?> hireCandidateAsEmployee(@PathVariable Long id,
                                                      @RequestBody Map<String, Long> body,
                                                      Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        Long requestId = body.get("resourceRequestId");
        if (requestId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "resourceRequestId is required"));
        }
        try {
            return ResponseEntity.ok(candidateService.hireCandidateAsEmployee(id, requestId, auth.getName()));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * GET /api/candidates/{id}/cv — HR downloads candidate CV
     */
    @GetMapping("/api/candidates/{id}/cv")
    public ResponseEntity<?> downloadCv(@PathVariable Long id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        try {
            byte[] bytes = candidateService.downloadCv(id);
            String filename = candidateService.getCvFilename(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(bytes);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to download CV."));
        }
    }
}

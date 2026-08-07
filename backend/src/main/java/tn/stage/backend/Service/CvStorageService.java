package tn.stage.backend.Service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for CV file storage.
 *
 * The current implementation stores files locally.
 * To switch to AWS S3, Azure Blob, or MinIO, implement this interface
 * and register it as a Spring Bean — zero changes to CandidateService.
 */
public interface CvStorageService {

    /**
     * Store the uploaded CV file and return the storage reference (local path or cloud URL).
     *
     * @param file     the uploaded multipart file
     * @param candidateEmail used to organize files in subdirectories
     * @return storage reference string (opaque to business logic)
     */
    String store(MultipartFile file, String candidateEmail) throws java.io.IOException;

    /**
     * Read the file bytes from storage — used when HR downloads the CV.
     *
     * @param storedReference the value returned by {@link #store}
     * @return raw file bytes
     */
    byte[] retrieve(String storedReference) throws java.io.IOException;

    /**
     * Delete the stored file. Called when a candidate record is purged.
     */
    void delete(String storedReference) throws java.io.IOException;
}

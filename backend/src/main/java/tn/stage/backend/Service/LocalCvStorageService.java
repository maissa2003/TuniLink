package tn.stage.backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * Local filesystem implementation of {@link CvStorageService}.
 *
 * Files are stored at: {workdir}/uploads/cv/{UUID}.{ext}
 *
 * To switch to cloud storage (S3 / Azure Blob / MinIO):
 *  1. Create a new class implementing CvStorageService
 *  2. Annotate it with @Service (and @Primary if needed)
 *  3. Remove @Service from this class or use @ConditionalOnProperty
 */
@Service
public class LocalCvStorageService implements CvStorageService {

    private static final String CV_UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/cv/";

    @Override
    public String store(MultipartFile file, String candidateEmail) throws IOException {
        Path dir = Paths.get(CV_UPLOAD_DIR);
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }

        String originalName = file.getOriginalFilename();
        String extension = (originalName != null && originalName.contains("."))
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".pdf";

        String storedName = UUID.randomUUID() + extension;
        Path destination = dir.resolve(storedName);
        Files.copy(file.getInputStream(), destination);

        return destination.toAbsolutePath().toString();
    }

    @Override
    public byte[] retrieve(String storedReference) throws IOException {
        return Files.readAllBytes(Paths.get(storedReference));
    }

    @Override
    public void delete(String storedReference) throws IOException {
        Path path = Paths.get(storedReference);
        if (Files.exists(path)) {
            Files.delete(path);
        }
    }
}

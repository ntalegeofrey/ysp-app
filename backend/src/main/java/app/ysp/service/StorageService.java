package app.ysp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class StorageService {

    @Autowired(required = false)
    private S3Client s3Client;

    @Value("${s3.bucket-name:ysp-app}")
    private String bucketName;

    @Value("${upload.local-path:/opt/ysp-app/uploads}")
    private String localUploadPath;

    @Value("${s3.public-url:https://usc1.contabostorage.com/ysp-app}")
    private String s3PublicUrl;

    /**
     * Upload a file to S3 or local storage
     * @param file The file to upload
     * @param folder The folder/prefix (e.g., "shift-logs", "incidents")
     * @return The URL to access the file
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("Cannot upload empty file");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;
        String key = folder + "/" + filename;

        // Use S3 if configured, otherwise fallback to local storage
        if (s3Client != null) {
            return uploadToS3(file, key);
        } else {
            return uploadLocally(file, key);
        }
    }

    /**
     * Upload to Contabo S3
     */
    private String uploadToS3(MultipartFile file, String key) throws IOException {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            // Return public URL
            return s3PublicUrl + "/" + key;
        } catch (Exception e) {
            throw new IOException("Failed to upload to S3: " + e.getMessage(), e);
        }
    }

    /**
     * Upload to local filesystem (fallback)
     */
    private String uploadLocally(MultipartFile file, String key) throws IOException {
        Path uploadDir = Paths.get(localUploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        Path filePath = uploadDir.resolve(key);
        Path parentDir = filePath.getParent();
        if (parentDir != null && !Files.exists(parentDir)) {
            Files.createDirectories(parentDir);
        }

        Files.write(filePath, file.getBytes());

        // Return relative URL for nginx to serve
        return "/uploads/" + key;
    }

    /**
     * Delete a file from S3 or local storage
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            if (s3Client != null && fileUrl.startsWith(s3PublicUrl)) {
                // Extract key from URL
                String key = fileUrl.substring(s3PublicUrl.length() + 1);
                DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();
                s3Client.deleteObject(deleteRequest);
            } else if (fileUrl.startsWith("/uploads/")) {
                // Delete from local storage
                String key = fileUrl.substring("/uploads/".length());
                Path filePath = Paths.get(localUploadPath, key);
                Files.deleteIfExists(filePath);
            }
        } catch (Exception e) {
            System.err.println("Failed to delete file: " + fileUrl + " - " + e.getMessage());
        }
    }

    /**
     * Check if S3 is configured
     */
    public boolean isS3Configured() {
        return s3Client != null;
    }
}

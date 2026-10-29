package com.study.backend.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CourseFileStorageService {
    private static final long MAX_FILE_SIZE = 20L * 1024 * 1024;
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "pptx", "txt");
    private final Path storageDirectory;

    public CourseFileStorageService(@Value("${app.course-upload-dir:uploads/courses}") String directory) {
        this.storageDirectory = Path.of(directory).toAbsolutePath().normalize();
    }

    public StoredCourseFile store(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course material must be 20 MB or smaller.");
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename())
                .replace('\\', '/');
        originalName = originalName.substring(originalName.lastIndexOf('/') + 1);
        String extension = StringUtils.getFilenameExtension(originalName);
        if (extension == null || !ALLOWED_EXTENSIONS.contains(extension.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload a PDF, DOCX, PPTX, or TXT file.");
        }

        String safeOriginalName = originalName.length() > 255 ? originalName.substring(originalName.length() - 255) : originalName;
        String storageKey = UUID.randomUUID() + "." + extension.toLowerCase(Locale.ROOT);
        Path destination = storageDirectory.resolve(storageKey).normalize();
        if (!destination.startsWith(storageDirectory)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid course material filename.");
        }

        try {
            Files.createDirectories(storageDirectory);
            file.transferTo(destination);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store course material.", exception);
        }

        return new StoredCourseFile(safeOriginalName, storageKey, contentTypeFor(extension), file.getSize());
    }

    public Resource load(String storageKey) {
        if (storageKey == null || !storageKey.matches("[a-fA-F0-9-]+\\.(pdf|docx|pptx|txt)")) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course material not found.");
        }
        try {
            Path path = storageDirectory.resolve(storageKey).normalize();
            if (!path.startsWith(storageDirectory)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course material not found.");
            }
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists() && resource.isReadable()) return resource;
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course material not found.", exception);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course material not found.");
    }

    public void delete(String storageKey) {
        if (storageKey == null || !storageKey.matches("[a-fA-F0-9-]+\\.(pdf|docx|pptx|txt)")) return;
        try {
            Path path = storageDirectory.resolve(storageKey).normalize();
            if (path.startsWith(storageDirectory)) Files.deleteIfExists(path);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not remove course material.", exception);
        }
    }

    private String contentTypeFor(String extension) {
        return switch (extension.toLowerCase(Locale.ROOT)) {
            case "pdf" -> "application/pdf";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            default -> "text/plain";
        };
    }

    public record StoredCourseFile(String originalName, String storageKey, String contentType, long size) { }
}

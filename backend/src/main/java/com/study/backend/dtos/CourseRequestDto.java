package com.study.backend.dtos;

import com.study.backend.entities.TestCategory;
import com.study.backend.entities.CourseSubtopic;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseRequestDto {
    @NotBlank @Size(max = 200)
    private String title;
    @NotBlank
    private String description;
    @NotNull
    private TestCategory category;
    @NotNull
    private CourseSubtopic subtopic;
    private String learningContent;
    private String youtubeUrl;
    private MultipartFile learningFile;
}

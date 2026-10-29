package com.study.backend.dtos;

import com.study.backend.entities.TestCategory;
import com.study.backend.entities.CourseSubtopic;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseLearningResponseDto {
    private String id;
    private String title;
    private String description;
    private String learningContent;
    private TestCategory category;
    private CourseSubtopic subtopic;
    private boolean learningCompleted;
    private String learningFileName;
    private String youtubeUrl;
}

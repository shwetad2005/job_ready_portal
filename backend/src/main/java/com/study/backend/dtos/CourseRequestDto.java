package com.study.backend.dtos;

import java.math.BigDecimal;
import jakarta.validation.constraints.DecimalMin;
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
    @NotNull @DecimalMin("0.00")
    private BigDecimal price;
}

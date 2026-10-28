
package com.study.backend.validators;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

// This annotation is used to check whether
// password and confirm password are the same
@Documented

// This annotation will be available at runtime
@Retention(RetentionPolicy.RUNTIME)

// This annotation can be applied to a class
@Target(ElementType.TYPE)

// Connect this annotation with its validation logic
@Constraint(validatedBy = PasswordMatchValidator.class)
public @interface PasswordMatch {

    // Default error message shown when passwords do not match
    String message() default "Password and Confirm Password do not match";

    // Used to group validation rules
    Class<?>[] groups() default {};

    // Used to pass additional information about validation
    Class<? extends Payload>[] payload() default {};
}

//@interface PasswordMatch — creates a custom validation annotation.
//@Target(ElementType.TYPE) — allows us to apply it to a class, such as UserRequestDto.
//@Constraint — connects the annotation to PasswordMatchValidator.
//message() — defines the error message when validation fails.
//groups() and payload() — are required methods for a Bean Validation custom constraint.
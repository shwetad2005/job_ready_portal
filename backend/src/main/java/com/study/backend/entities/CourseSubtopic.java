package com.study.backend.entities;

public enum CourseSubtopic {
    QUANTITATIVE_APTITUDE(TestCategory.APTITUDE),
    LOGICAL_REASONING(TestCategory.APTITUDE),
    VERBAL_ABILITY(TestCategory.APTITUDE),
    APTITUDE_PRACTICE_TESTS(TestCategory.APTITUDE),
    PROGRAMMING_FUNDAMENTALS(TestCategory.CODING),
    ARRAYS_AND_STRINGS(TestCategory.CODING),
    DATA_STRUCTURES_AND_ALGORITHMS(TestCategory.CODING),
    CODING_PRACTICE_TESTS(TestCategory.CODING),
    HR_INTERVIEW(TestCategory.INTERVIEW_PREPARATION),
    TECHNICAL_INTERVIEW(TestCategory.INTERVIEW_PREPARATION),
    PROJECT_BASED_INTERVIEW(TestCategory.INTERVIEW_PREPARATION),
    INTERVIEW_PRACTICE_TESTS(TestCategory.INTERVIEW_PREPARATION);

    private final TestCategory category;

    CourseSubtopic(TestCategory category) {
        this.category = category;
    }

    public TestCategory getCategory() {
        return category;
    }
}

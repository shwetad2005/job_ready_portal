package com.study.backend.services;

import java.util.List;

import com.study.backend.entities.Test;
import com.study.backend.entities.TestCategory;

public interface TestService {

    Test createTest(Test test);

    Test getTestById(String id);

    List<Test> getAllTests();

    List<Test> getActiveTests();

    List<Test> getPublishedTests();

    List<Test> getPublishedTestsByCategory(TestCategory category);

    Test publishTest(String id);

    Test updateTest(String id, Test test);

    void deleteTest(String id);
}

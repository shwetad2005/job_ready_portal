package com.study.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.backend.entities.Test;
import com.study.backend.entities.TestCategory;
import com.study.backend.repositories.TestRepository;
import com.study.backend.services.TestService;

@RestController
@RequestMapping("/tests")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {

    @Autowired
    private TestService testService;

    @Autowired
    private TestRepository testRepository;

    @PostMapping
    public ResponseEntity<Test> createTest(@RequestBody Test test) {
        Test createdTest = testService.createTest(test);
        return ResponseEntity.ok(createdTest);
    }

    @GetMapping
    public ResponseEntity<List<Test>> getAllTests() {
        List<Test> tests = testService.getAllTests();
        return ResponseEntity.ok(tests);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Test>> getActiveTests() {
        List<Test> tests = testService.getActiveTests();
        return ResponseEntity.ok(tests);
    }

    @GetMapping("/published")
    public ResponseEntity<List<Test>> getPublishedTests() {
        List<Test> tests = testService.getPublishedTests();
        return ResponseEntity.ok(tests);
    }

    @GetMapping("/published/category/{category}")
    public ResponseEntity<List<Test>> getPublishedTestsByCategory(
            @PathVariable TestCategory category) {
        return ResponseEntity.ok(
                testService.getPublishedTestsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable String id) {
        Test test = testService.getTestById(id);
        return ResponseEntity.ok(test);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Test> updateTest(@PathVariable String id, @RequestBody Test test) {
        Test updatedTest = testService.updateTest(id, test);
        return ResponseEntity.ok(updatedTest);
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<Test> publishTest(@PathVariable String id) {
        Test publishedTest = testService.publishTest(id);
        return ResponseEntity.ok(publishedTest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable String id) {
        testService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }
}

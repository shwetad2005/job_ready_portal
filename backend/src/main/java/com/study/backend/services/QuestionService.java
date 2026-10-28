

package com.study.backend.services;

import java.util.List;

import com.study.backend.dtos.BulkQuestionImportDto;
import com.study.backend.entities.Question;

public interface QuestionService {

    // Create a new question
    Question createQuestion(Question question);

    // Get all questions
    List<Question> getAllQuestions();

    List<Question> getReusableQuestions(String testId);

    Question copyQuestionToTest(Integer questionId, String testId);

    List<Question> copyQuestionsToTest(List<Integer> questionIds, String testId);

    // Get a question by ID
    Question getQuestionById(Integer id);

    // Update an existing question
    Question updateQuestion(Integer id, Question question);

    // Delete a question by ID
    void deleteQuestion(Integer id);

    // Bulk import questions
    List<Question> bulkImportQuestions(BulkQuestionImportDto bulkImportDto);
}

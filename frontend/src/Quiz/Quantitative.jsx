import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiFlag,
    FiTarget,
} from "react-icons/fi";

//import aptitudeQuestions from "../data/aptitudeQuestions";
import api from "../api";

// Duration will be calculated based on total marks (60 minutes for 50-mark tests)

function Quantitative() {

    const navigate = useNavigate();

    // Questions used in the quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [selectedAnswer, setSelectedAnswer] = useState("");

    const [answers, setAnswers] = useState([]);

    const [skippedQuestions, setSkippedQuestions] = useState([]);

    const [timeLeft, setTimeLeft] = useState(0);

    // Prevent test from being submitted multiple times
    const [testFinished, setTestFinished] =
        useState(false);


    /* =========================================
    // LOAD QUESTIONS FROM ADMIN
        useEffect(() => {

        const savedQuestions =
            JSON.parse(
                localStorage.getItem("adminQuestions")
            );

        if (
            savedQuestions &&
            savedQuestions.length > 0
        ) {

            const aptitudeAdminQuestions =
                savedQuestions.filter(
                    (question) =>
                        question.category === "Aptitude"
                );

            if (
                aptitudeAdminQuestions.length > 0
            ) {

                setQuizQuestions(
                    aptitudeAdminQuestions
                );

                setAnswers(
                    Array(
                        aptitudeAdminQuestions.length
                    ).fill("")
                );

                setSkippedQuestions(
                    Array(
                        aptitudeAdminQuestions.length
                    ).fill(false)
                );

                return;
            }
        }


        // Fallback to default questions

        setQuizQuestions(
            aptitudeQuestions
        );

        setAnswers(
            Array(
                aptitudeQuestions.length
            ).fill("")
        );

        setSkippedQuestions(
            Array(
                aptitudeQuestions.length
            ).fill(false)
        );

    }, []);
     =========================================*/
   
  // Load Aptitude questions from Spring Boot backend
  useEffect(() => {
    const fetchAptitudeQuestions = async () => {
      try {
        const response = await api.get("/questions");

        // Get only Aptitude category questions
        const aptitudeAdminQuestions = response.data
          .filter(
            (q) =>
              q.category?.toLowerCase() === "aptitude"
          )
          .map((q) => ({
            id: q.id,
            question: q.questionText,
            options: [
              q.optionA || "",
              q.optionB || "",
              q.optionC || "",
              q.optionD || "",
            ],
            answer: q.correctAnswer || "",
            category: q.category,
            explanation: q.explanation || "",
            marks: q.marks ?? 1,
          }));

          // for debugging
console.log("Backend Questions:", response.data);
console.log("Aptitude Questions:", aptitudeAdminQuestions);

setQuizQuestions(aptitudeAdminQuestions);
        setQuizQuestions(aptitudeAdminQuestions);
        setAnswers(
          Array(aptitudeAdminQuestions.length).fill("")
        );
        setSkippedQuestions(
          Array(aptitudeAdminQuestions.length).fill(false)
        );

        // Calculate total marks from questions
        const totalMarks = aptitudeAdminQuestions.reduce((sum, q) => sum + (q.marks || 1), 0);

        // Set timer: 60 minutes for 50-mark tests, otherwise 1 minute per question minimum
        const durationMinutes = totalMarks === 50 ? 60 : Math.max(aptitudeAdminQuestions.length, 30);
        setTimeLeft(durationMinutes * 60);
      } catch (error) {
        console.error(
          "Error loading Aptitude questions:",
          error
        );
        alert(
          " Failed to load the question. Please check the backend."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAptitudeQuestions();
  }, []);



    const totalQuestions =
        quizQuestions.length;


    const question =
        quizQuestions[currentQuestion];


    const answeredCount =
        answers.filter(Boolean).length;


    const progress =
        totalQuestions > 0
            ? (
                (currentQuestion + 1) /
                totalQuestions
            ) * 100
            : 0;


    const skippedCount =
        skippedQuestions.filter(
            (isSkipped, index) =>
                isSkipped && !answers[index]
        ).length;


    const minutes =
        Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, "0");


    const seconds =
        (timeLeft % 60)
            .toString()
            .padStart(2, "0");


    // =========================================
    // FINISH TEST
    // =========================================

    const finishTest = useCallback((
        finalAnswers = answers
    ) => {

        // Prevent duplicate result
        if (testFinished) {
            return;
        }

        setTestFinished(true);


        // Calculate score using question marks
        let totalScore = 0;
        let totalMarks = 0;


        quizQuestions.forEach(
            (questionItem, index) => {

                const questionMarks = questionItem.marks || 1;
                totalMarks += questionMarks;

                if (
                    finalAnswers[index] ===
                    questionItem.answer
                ) {

                    totalScore += questionMarks;

                }

            }
        );


        // =========================================
        // GET CURRENT STUDENT
        // =========================================

        const currentUser =
            JSON.parse(
                localStorage.getItem("user")
            );


        const studentName =
            currentUser?.fullName ||
            "Unknown Student";


        const studentEmail =
            currentUser?.email ||
            "";


        // =========================================
        // CALCULATE PERCENTAGE
        // =========================================

        const percentage =
            totalMarks > 0
                ? Math.round(
                    (
                        totalScore /
                        totalMarks
                    ) * 100
                )
                : 0;


        // =========================================
        // SAVE TO LOCALSTORAGE (Practice Mode)
        // =========================================

        // GET EXISTING RESULTS
        const existingScores =
            JSON.parse(
                localStorage.getItem(
                    "weeklyScores"
                )
            ) || [];


        // CREATE NEW RESULT
        const newResult = {

            id: Date.now(),

            // Student information
            name: studentName,

            fullName: studentName,

            email: studentEmail,

            // Test information
            category: "Aptitude",

            testName: "Aptitude Practice Test",

            score: totalScore,

            total: totalMarks,

            percentage: percentage,

            date:
                new Date().toLocaleString(),

        };


        // SAVE RESULT
        localStorage.setItem(
            "weeklyScores",
            JSON.stringify([
                ...existingScores,
                newResult,
            ])
        );

        // Navigate to result page
        navigate(
            "/result",
            {
                state: {

                    score: totalScore,

                    total: totalMarks,

                    percentage: percentage,

                    category: "Aptitude",

                    studentName: studentName,

                },
            }
        );

    }, [testFinished, quizQuestions, answers, navigate]);


    // =========================================
    // TIMER
    // =========================================

    useEffect(() => {

        // Don't start timer if timeLeft is 0 (questions not loaded yet)
        if (timeLeft <= 0) {
            return;
        }

        const timerId =
            setInterval(() => {

                setTimeLeft(
                    (remainingTime) => {
                        if (remainingTime <= 1) {
                            finishTest();
                            return 0;
                        }
                        return remainingTime - 1;
                    }
                );

            }, 1000);


        return () =>
            clearInterval(timerId);

    }, [timeLeft, finishTest, testFinished]);


    // =========================================
    // SELECT ANSWER
    // =========================================

    const handleOptionSelect =
        (option) => {

            const updatedAnswers =
                [...answers];

            const updatedSkippedQuestions =
                [...skippedQuestions];


            updatedAnswers[
                currentQuestion
            ] = option;


            updatedSkippedQuestions[
                currentQuestion
            ] = false;


            setAnswers(
                updatedAnswers
            );

            setSkippedQuestions(
                updatedSkippedQuestions
            );

            setSelectedAnswer(
                option
            );

        };


    // =========================================
    // JUMP TO QUESTION
    // =========================================

    const handleQuestionJump =
        (questionIndex) => {

            setCurrentQuestion(
                questionIndex
            );

            setSelectedAnswer(
                answers[questionIndex] || ""
            );

        };


    // =========================================
    // PREVIOUS
    // =========================================

    const handlePrevious = () => {

        if (currentQuestion > 0) {

            handleQuestionJump(
                currentQuestion - 1
            );

        }

    };


    // =========================================
    // SKIP
    // =========================================

    const handleSkip = () => {

        const updatedAnswers =
            [...answers];

        const updatedSkippedQuestions =
            [...skippedQuestions];


        updatedAnswers[
            currentQuestion
        ] = "";


        updatedSkippedQuestions[
            currentQuestion
        ] = true;


        setAnswers(
            updatedAnswers
        );

        setSkippedQuestions(
            updatedSkippedQuestions
        );


        if (
            currentQuestion <
            totalQuestions - 1
        ) {

            // Directly move to next question
            const nextQuestion =
                currentQuestion + 1;

            setCurrentQuestion(
                nextQuestion
            );

            setSelectedAnswer(
                updatedAnswers[nextQuestion] || ""
            );

            return;

        }


        // Last question → submit
        setSelectedAnswer("");

        finishTest(
            updatedAnswers
        );

    };


    // =========================================
    // NEXT
    // =========================================

    const handleNext = () => {

        if (
            selectedAnswer === ""
        ) {

            alert(
                "Please select an answer."
            );

            return;

        }


        if (
            currentQuestion <
            totalQuestions - 1
        ) {

            // Save current answer
            const updatedAnswers =
                [...answers];

            updatedAnswers[
                currentQuestion
            ] = selectedAnswer;

            setAnswers(
                updatedAnswers
            );


            // Move to next question
            const nextQuestion =
                currentQuestion + 1;

            setCurrentQuestion(
                nextQuestion
            );

            setSelectedAnswer(
                updatedAnswers[nextQuestion] || ""
            );

            return;

        }


        // Last question
        const finalAnswers =
            [...answers];


        finalAnswers[
            currentQuestion
        ] = selectedAnswer;


        finishTest(
            finalAnswers
        );

    };

    
    // =========================================
    //  Loding que 
    // =========================================
if (isLoading) {
  return (
    <div className="container mt-5 text-center">
      <h3>Loading Aptitude Questions...</h3>
    </div>
  );
}
    // =========================================
    // SAFETY CHECK
    // =========================================

    if (!question) {

        return (

            <div className="container mt-5 text-center">

                <h3>
                    No aptitude questions available.
                </h3>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() =>
                        navigate(
                            "/aptitude"
                        )
                    }
                >
                    Back to Aptitude
                </button>

            </div>

        );

    }


    return (

        <main className="quant-page">

            <section className="quant-shell">

                <div className="quant-hero">

                    <div>

                        <span className="quant-kicker">
                            Aptitude practice
                        </span>

                        <h1>
                            Quantitative Aptitude Test
                        </h1>

                        <p>
                            Solve each question carefully
                            and track your progress as you
                            move through the set.
                        </p>

                    </div>


                    <div
                        className="quant-scoreboard"
                        aria-label="Test progress summary"
                    >

                        <div>

                            <FiTarget
                                aria-hidden="true"
                            />

                            <span>
                                {currentQuestion + 1}/
                                {totalQuestions}
                            </span>

                            <small>
                                Current
                            </small>

                        </div>


                        <div>

                            <FiCheckCircle
                                aria-hidden="true"
                            />

                            <span>
                                {answeredCount}
                            </span>

                            <small>
                                Answered
                            </small>

                        </div>


                        <div>

                            <FiFlag
                                aria-hidden="true"
                            />

                            <span>
                                {skippedCount}
                            </span>

                            <small>
                                Skipped
                            </small>

                        </div>

                    </div>

                </div>


                <div className="quant-workspace">

                    <aside
                        className="quant-sidebar"
                        aria-label="Question navigator"
                    >

                        <div className="quant-timer">

                            <FiClock
                                aria-hidden="true"
                            />

                            <div>

                                <span>
                                    {minutes}:{seconds}
                                </span>

                                <small>
                                    Time left
                                </small>

                            </div>

                        </div>


                        <div className="quant-sidebar-title">

                            <span>
                                Questions
                            </span>

                            <small>
                                {answeredCount}/
                                {totalQuestions}
                                {" "}answered
                            </small>

                        </div>


                        <div className="quant-question-grid">

                            {quizQuestions.map(
                                (_, index) => {

                                    const isCurrent =
                                        currentQuestion ===
                                        index;


                                    const isAnswered =
                                        Boolean(
                                            answers[index]
                                        );


                                    const isSkipped =
                                        skippedQuestions[
                                            index
                                        ] &&
                                        !isAnswered;


                                    return (

                                        <button
                                            key={index}
                                            type="button"
                                            className={[
                                                "quant-question-nav",
                                                isCurrent
                                                    ? "is-current"
                                                    : "",
                                                isAnswered
                                                    ? "is-answered"
                                                    : "",
                                                isSkipped
                                                    ? "is-skipped"
                                                    : "",
                                            ].join(" ")}
                                            onClick={() =>
                                                handleQuestionJump(
                                                    index
                                                )
                                            }
                                            aria-label={
                                                `Go to question ${
                                                    index + 1
                                                }`
                                            }
                                            aria-current={
                                                isCurrent
                                                    ? "step"
                                                    : undefined
                                            }
                                        >

                                            {index + 1}

                                        </button>

                                    );

                                }
                            )}

                        </div>

                    </aside>


                    <div className="quant-card">

                        <div className="quant-card-header">

                            <div>

                                <span className="quant-question-count">

                                    Question{" "}
                                    {currentQuestion + 1}
                                    {" "}of{" "}
                                    {totalQuestions}

                                </span>


                                <h2>
                                    {question.question}
                                </h2>

                            </div>


                            <div
                                className="quant-progress-meter"
                                aria-hidden="true"
                            >

                                <span
                                    style={{
                                        width:
                                            `${progress}%`
                                    }}
                                />

                            </div>

                        </div>


                        <div
                            className="quant-options"
                            role="radiogroup"
                            aria-label="Answer options"
                        >

                            {question.options.map(
                                (option, index) => {

                                    const optionId =
                                        `quant-option-${index}`;


                                    const isSelected =
                                        selectedAnswer ===
                                        option;


                                    return (

                                        <label
                                            key={optionId}
                                            className={
                                                `quant-option ${
                                                    isSelected
                                                        ? "is-selected"
                                                        : ""
                                                }`
                                            }
                                            htmlFor={optionId}
                                        >

                                            <input
                                                id={optionId}
                                                type="radio"
                                                name="answer"
                                                value={option}
                                                onChange={() =>
                                                    handleOptionSelect(
                                                        option
                                                    )
                                                }
                                                checked={
                                                    isSelected
                                                }
                                            />


                                            <span className="quant-option-marker">

                                                {String.fromCharCode(
                                                    65 + index
                                                )}

                                            </span>


                                            <span className="quant-option-text">

                                                {option}

                                            </span>

                                        </label>

                                    );

                                }
                            )}

                        </div>


                        <div className="quant-actions">

                            <button
                                className="quant-btn quant-btn-secondary"
                                onClick={
                                    handlePrevious
                                }
                                disabled={
                                    currentQuestion === 0
                                }
                            >

                                <FiArrowLeft
                                    aria-hidden="true"
                                />

                                Previous

                            </button>


                            <button
                                className="quant-btn quant-btn-skip"
                                onClick={
                                    handleSkip
                                }
                                type="button"
                            >

                                <FiFlag
                                    aria-hidden="true"
                                />

                                Skip

                            </button>


                            <button
                                className="quant-btn quant-btn-primary"
                                onClick={
                                    handleNext
                                }
                            >

                                {currentQuestion ===
                                totalQuestions - 1
                                    ? "Submit Test"
                                    : "Next Question"}


                                {currentQuestion ===
                                totalQuestions - 1
                                    ? (
                                        <FiCheckCircle
                                            aria-hidden="true"
                                        />
                                    )
                                    : (
                                        <FiArrowRight
                                            aria-hidden="true"
                                        />
                                    )}

                            </button>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    );

}

export default Quantitative;
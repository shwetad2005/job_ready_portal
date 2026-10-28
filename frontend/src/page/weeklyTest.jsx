import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function WeeklyTest() {

    const navigate = useNavigate();
    const categoryLabels = {
        APTITUDE: "Aptitude",
        CODING: "Coding",
        INTERVIEW_PREPARATION: "Interview Preparation",
    };

    // Available tests
    const [publishedTests, setPublishedTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [loading, setLoading] = useState(true);

    // Test settings
    const [testSettings, setTestSettings] = useState(null);

    // Questions
    const [questions, setQuestions] = useState([]);

    // Current question
    const [currentQuestion, setCurrentQuestion] = useState(0);

    // User answers
    const [answers, setAnswers] = useState([]);

    // Timer in seconds
    const [timeLeft, setTimeLeft] = useState(0);

    // Prevent duplicate submit
    const submittedRef = useRef(false);

    // Fetch published tests
    useEffect(() => {
        fetchPublishedTests();
    }, []);

    const fetchPublishedTests = async () => {
        try {
            const response = await api.get("/tests/published");
            setPublishedTests(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading tests:", error);
            alert("Failed to load available tests.");
            setLoading(false);
        }
    };

    // Select a test and load its questions
    const selectTest = async (test) => {
        try {
            setLoading(true);
            const testResponse = await api.get(`/tests/${test.id}`);
            const questionsResponse = await api.get(`/questions/test/${test.id}`);

            setSelectedTest(testResponse.data);

            // Format questions
            const formattedQuestions = questionsResponse.data.map((q) => ({
                id: q.id,
                question: q.questionText,
                options: [
                    q.optionA || "",
                    q.optionB || "",
                    q.optionC || "",
                    q.optionD || "",
                ],
                answer: q.correctAnswer || "",
                category: q.category || "Aptitude",
                marks: q.marks ?? 1,
            }));

            setQuestions(formattedQuestions);
            setAnswers(Array(formattedQuestions.length).fill(""));

            // Set timer
            setTimeLeft(testResponse.data.durationMinutes * 60);

            setTestSettings({
                title: testResponse.data.title,
                duration: testResponse.data.durationMinutes,
                totalMarks: testResponse.data.totalMarks,
                active: true,
            });

            setLoading(false);
        } catch (error) {
            console.error("Error loading test:", error);
            alert("Failed to load the test.");
            setLoading(false);
        }
    };

    // TIMER
    useEffect(() => {
        if (
            !testSettings ||
            questions.length === 0 ||
            timeLeft <= 0 ||
            submittedRef.current
        ) {
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((previousTime) => previousTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, testSettings, questions.length]);

    // AUTO SUBMIT
    useEffect(() => {
        if (
            testSettings &&
            questions.length > 0 &&
            timeLeft === 0 &&
            !submittedRef.current
        ) {
            handleSubmit();
        }
    }, [timeLeft, testSettings, questions.length]);

    // LOADING
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary"></div>
                <h4 className="mt-3">Loading...</h4>
            </div>
        );
    }

    // SHOW AVAILABLE TESTS
    if (!selectedTest) {
        return (
            <div className="container mt-5 mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="fw-bold">Available Tests 📝</h1>
                        <p className="text-secondary mb-0">
                            Select a published test to begin
                        </p>
                    </div>
                    <button
                        className="btn btn-dark"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Dashboard
                    </button>
                </div>

                {publishedTests.length === 0 ? (
                    <div className="card shadow p-5 text-center">
                        <h3 className="fw-bold">No Tests Available</h3>
                        <p className="text-secondary mt-3">
                            No tests have been published yet. Please check back later.
                        </p>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="row">
                        {publishedTests.map((test) => {
                            const deadline = new Date(test.deadline);
                            const isExpired = deadline < new Date();

                            return (
                                <div className="col-md-6 col-lg-4 mb-4" key={test.id}>
                                    <div className="card shadow-sm h-100">
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">{test.title}</h5>
                                            <span className="badge bg-primary mb-2">
                                                {categoryLabels[test.category] || "Aptitude"}
                                            </span>
                                            <p className="card-text text-secondary small">
                                                {test.description || "No description"}
                                            </p>
                                            <div className="small text-secondary mb-3">
                                                <div>📅 Deadline: {deadline.toLocaleString()}</div>
                                                <div>⏱️ Duration: {test.durationMinutes} mins</div>
                                                <div>📊 Total Marks: {test.totalMarks}</div>
                                                <div>❓ Questions: {test.questions?.length || 0}</div>
                                            </div>
                                            {isExpired ? (
                                                <button
                                                    className="btn btn-secondary w-100"
                                                    disabled
                                                >
                                                    ⏰ Expired
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={() => selectTest(test)}
                                                >
                                                    Start Test →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // NO QUESTIONS
    if (questions.length === 0) {
        return (
            <div className="container mt-5">
                <div className="card shadow p-5 text-center">
                    <h3 className="fw-bold">No Questions Available</h3>
                    <p className="text-secondary mt-3">
                        This test has no questions yet.
                    </p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                            setSelectedTest(null);
                            setTestSettings(null);
                        }}
                    >
                        Back to Tests
                    </button>
                </div>
            </div>
        );
    }

    // Current question
    const question = questions[currentQuestion];

    // Timer minutes
    const minutes = Math.floor(timeLeft / 60);

    // Timer seconds
    const seconds = timeLeft % 60;

    // SELECT ANSWER
    const handleOptionSelect = (option) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = option;
        setAnswers(updatedAnswers);
    };

    // PREVIOUS
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // NEXT
    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    // SUBMIT TEST
    function handleSubmit() {
        // Prevent duplicate submission
        if (submittedRef.current) {
            return;
        }

        submittedRef.current = true;

        let score = 0;

        // Calculate score
        questions.forEach((question, index) => {
            if (answers[index] === question.answer) {
                score += question.marks || 1;
            }
        });

        // Navigate to result
        navigate("/weekly-result", {
            state: {
                score: score,
                total: testSettings.totalMarks,
                testName: testSettings.title,
            },
            replace: true,
        });
    }

    // UI
    return (
        <div className="container mt-5 mb-5">

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">
                        {testSettings.title} 📝
                    </h2>
                    <p className="text-secondary mb-0">
                        Test your placement preparation skills.
                    </p>
                </div>

                {/* TIMER */}
                <div
                    className={
                        timeLeft <= 60
                            ? "card shadow-sm border-danger px-4 py-2"
                            : "card shadow-sm px-4 py-2"
                    }
                >
                    <h5
                        className={
                            timeLeft <= 60
                                ? "mb-0 text-danger fw-bold"
                                : "mb-0 text-primary fw-bold"
                        }
                    >
                        ⏱️{" "}
                        {String(minutes).padStart(2, "0")}
                        :
                        {String(seconds).padStart(2, "0")}
                    </h5>
                </div>
            </div>

            {/* PROGRESS */}
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">
                        Question{" "}
                        {currentQuestion + 1}
                        {" "}of{" "}
                        {questions.length}
                    </span>

                    <span className="text-secondary">
                        {Math.round(
                            (
                                (currentQuestion + 1) /
                                questions.length
                            ) * 100
                        )}%
                    </span>
                </div>

                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width:
                                `${
                                    (
                                        (currentQuestion + 1) /
                                        questions.length
                                    ) * 100
                                }%`
                        }}
                    />
                </div>
            </div>

            {/* QUESTION CARD */}
            <div className="card shadow p-4">

                {/* QUESTION HEADER */}
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        Question{" "}
                        {currentQuestion + 1}
                        {" "}of{" "}
                        {questions.length}
                    </h5>

                    {/* CATEGORY */}
                    {question.category && (
                        <span className="badge bg-primary">
                            {question.category}
                        </span>
                    )}
                </div>

                <hr />

                {/* QUESTION */}
                <h4 className="mt-3">
                    {question.question}
                </h4>

                {/* OPTIONS */}
                <div className="mt-4">
                    {question.options.map(
                        (option, index) => (
                            <div
                                key={index}
                                className="form-check border rounded p-3 mb-3"
                                style={{
                                    cursor: "pointer"
                                }}
                            >
                                <input
                                    className="form-check-input ms-1"
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={option}
                                    checked={
                                        answers[
                                            currentQuestion
                                        ] === option
                                    }
                                    onChange={() =>
                                        handleOptionSelect(
                                            option
                                        )
                                    }
                                />

                                <label className="form-check-label ms-2">
                                    {option}
                                </label>
                            </div>
                        )
                    )}
                </div>

                {/* NAVIGATION BUTTONS */}
                <div className="d-flex justify-content-between mt-4">

                    {/* PREVIOUS */}
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrevious}
                        disabled={
                            currentQuestion === 0
                        }
                    >
                        ← Previous
                    </button>

                    {/* NEXT / SUBMIT */}
                    {currentQuestion ===
                    questions.length - 1 ? (
                        <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                        >
                            Submit Test ✓
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                        >
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default WeeklyTest;

import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const categoryDetails = {
    APTITUDE: {
        label: "Aptitude",
        dashboardPath: "/dashboard",
    },
    CODING: {
        label: "Coding",
        dashboardPath: "/dashboard",
    },
};

function PublishedCategoryTest({ category }) {
    const navigate = useNavigate();
    const details = categoryDetails[category];
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isStarting, setIsStarting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const submittedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;

        const loadTests = async () => {
            try {
                const response = await api.get(
                    `/tests/published/category/${category}`
                );
                if (isMounted) {
                    setTests(response.data);
                }
            } catch (error) {
                console.error(`Unable to load ${details.label} tests:`, error);
                if (isMounted) {
                    setErrorMessage("Unable to load published tests. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadTests();
        return () => {
            isMounted = false;
        };
    }, [category, details.label]);

    const startTest = async (test) => {
        setIsStarting(true);
        setErrorMessage("");

        try {
            const response = await api.get(`/questions/test/${test.id}`);
            const testQuestions = response.data.map((question) => ({
                id: question.id,
                question: question.questionText,
                options: [
                    question.optionA,
                    question.optionB,
                    question.optionC,
                    question.optionD,
                ].filter(Boolean),
            }));

            if (testQuestions.length === 0) {
                setErrorMessage("This test does not have any questions yet.");
                return;
            }

            submittedRef.current = false;
            setSelectedTest(test);
            setQuestions(testQuestions);
            setAnswers({});
            setCurrentIndex(0);
            setTimeLeft((test.durationMinutes || 60) * 60);
        } catch (error) {
            console.error("Unable to load test questions:", error);
            setErrorMessage("Unable to load this test. Please try again.");
        } finally {
            setIsStarting(false);
        }
    };

    const submitTest = useCallback(async () => {
        if (!selectedTest || submittedRef.current) {
            return;
        }

        submittedRef.current = true;
        setErrorMessage("");

        try {
            const response = await api.post("/attempts", {
                testId: selectedTest.id,
                answers: questions.map((question, index) => ({
                    questionId: question.id,
                    selectedAnswer: answers[index] || "",
                })),
            });
            const result = response.data;

            navigate("/result", {
                state: {
                    score: result.score,
                    total: result.total,
                    percentage: result.percentage,
                    category: details.label,
                    testName: selectedTest.title,
                },
            });
        } catch (error) {
            console.error("Unable to submit test result:", error);
            submittedRef.current = false;
            setErrorMessage("Unable to save your result. Please try submitting again.");
        }
    }, [answers, details.label, navigate, questions, selectedTest]);

    useEffect(() => {
        if (!selectedTest || submittedRef.current) {
            return undefined;
        }

        if (timeLeft <= 0) {
            submitTest();
            return undefined;
        }

        const timer = setTimeout(() => {
            setTimeLeft((remaining) => remaining - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [selectedTest, submitTest, timeLeft]);

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading published {details.label} tests...</p>
            </div>
        );
    }

    if (selectedTest && questions.length > 0) {
        const question = questions[currentIndex];
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return (
            <main className="container py-5">
                <section className="card shadow border-0">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between flex-wrap gap-3 mb-4">
                            <div>
                                <span className="badge bg-primary mb-2">{details.label}</span>
                                <h2 className="fw-bold">{selectedTest.title}</h2>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-dark fs-6">
                                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                                </span>
                                <div className="small text-secondary mt-2">
                                    Question {currentIndex + 1} of {questions.length}
                                </div>
                            </div>
                        </div>

                        <div className="progress mb-4" style={{ height: "8px" }}>
                            <div
                                className="progress-bar"
                                style={{
                                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                                }}
                            />
                        </div>

                        <h5 className="mb-4">{question.question}</h5>
                        {question.options.map((option, index) => (
                            <button
                                key={`${question.id}-${index}`}
                                type="button"
                                className={`btn w-100 text-start mb-3 p-3 ${
                                    answers[currentIndex] === option
                                        ? "btn-primary"
                                        : "btn-outline-secondary"
                                }`}
                                onClick={() =>
                                    setAnswers((previous) => ({
                                        ...previous,
                                        [currentIndex]: option,
                                    }))
                                }
                            >
                                {String.fromCharCode(65 + index)}. {option}
                            </button>
                        ))}

                        {errorMessage && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        <div className="d-flex justify-content-between gap-2 mt-4">
                            <button
                                className="btn btn-outline-dark"
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((index) => index - 1)}
                            >
                                Previous
                            </button>
                            {currentIndex < questions.length - 1 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setCurrentIndex((index) => index + 1)}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    className="btn btn-success"
                                    disabled={submittedRef.current}
                                    onClick={submitTest}
                                >
                                    Submit Test
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h1 className="fw-bold">Published {details.label} Tests</h1>
                    <p className="text-secondary mb-0">
                        Choose a published test to start practicing.
                    </p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(details.dashboardPath)}
                >
                    Back to Dashboard
                </button>
            </div>

            {errorMessage && (
                <div className="alert alert-warning" role="alert">
                    {errorMessage}
                </div>
            )}

            {tests.length === 0 ? (
                <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                        <h4>No published {details.label.toLowerCase()} tests yet</h4>
                        <p className="text-secondary mb-0">
                            Published tests will appear here when available.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {tests.map((test) => {
                        const expired = test.deadline && new Date(test.deadline) < new Date();

                        return (
                            <div className="col-md-6 col-lg-4 mb-4" key={test.id}>
                                <article className="card shadow-sm h-100">
                                    <div className="card-body d-flex flex-column">
                                        <span className="badge bg-primary align-self-start mb-2">
                                            {details.label}
                                        </span>
                                        <h5 className="card-title fw-bold">{test.title}</h5>
                                        <p className="text-secondary">
                                            {test.description || "No description"}
                                        </p>
                                        <div className="small text-secondary mb-3">
                                            <div>Duration: {test.durationMinutes} minutes</div>
                                            <div>Total marks: {test.totalMarks}</div>
                                            {test.deadline && (
                                                <div>
                                                    Deadline: {new Date(test.deadline).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-primary mt-auto"
                                            disabled={Boolean(expired) || isStarting}
                                            onClick={() => startTest(test)}
                                        >
                                            {expired
                                                ? "Test expired"
                                                : isStarting
                                                    ? "Loading test..."
                                                    : "Start Test"}
                                        </button>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}

export default PublishedCategoryTest;

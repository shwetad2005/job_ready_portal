import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function InterviewPractice() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isStartingTest, setIsStartingTest] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadTests = async () => {
            try {
                const response = await api.get(
                    "/tests/published/category/INTERVIEW_PREPARATION"
                );
                setTests(response.data);
            } catch (error) {
                console.error("Error loading published interview tests:", error);
                setErrorMessage("Unable to load interview tests. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        loadTests();
    }, []);

    const startTest = async (test) => {
        setIsStartingTest(true);
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
                answer: question.correctAnswer,
                marks: question.marks ?? 1,
            }));

            if (testQuestions.length === 0) {
                setErrorMessage("This test does not have any questions yet.");
                return;
            }

            setSelectedTest(test);
            setQuestions(testQuestions);
            setAnswers({});
            setCurrentIndex(0);
        } catch (error) {
            console.error("Error loading interview test questions:", error);
            setErrorMessage("Unable to load this test. Please try again.");
        } finally {
            setIsStartingTest(false);
        }
    };

    const submitTest = () => {
        const score = questions.reduce(
            (total, question, index) =>
                total +
                (answers[index] === question.answer ? question.marks : 0),
            0
        );
        const total = questions.reduce(
            (marks, question) => marks + question.marks,
            0
        );
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const savedResults = JSON.parse(
            localStorage.getItem("weeklyScores") || "[]"
        );

        savedResults.push({
            id: Date.now(),
            name: user.fullName || "Unknown Student",
            fullName: user.fullName || "Unknown Student",
            email: user.email || "",
            category: "Interview",
            testName: selectedTest.title,
            score,
            total,
            percentage,
            date: new Date().toLocaleString(),
        });
        localStorage.setItem("weeklyScores", JSON.stringify(savedResults));

        navigate("/result", {
            state: {
                studentName: user.fullName || "Unknown Student",
                category: "Interview",
                testName: selectedTest.title,
                score,
                total,
                percentage,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading interview tests...</p>
            </div>
        );
    }

    if (selectedTest && questions.length > 0) {
        const question = questions[currentIndex];

        return (
            <div className="container py-5">
                <div className="card shadow border-0">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between flex-wrap gap-2 mb-4">
                            <div>
                                <h3 className="fw-bold">{selectedTest.title}</h3>
                                <p className="text-secondary mb-0">Interview Preparation</p>
                            </div>
                            <span className="badge bg-primary fs-6 align-self-start">
                                Question {currentIndex + 1} / {questions.length}
                            </span>
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

                        <div className="d-flex justify-content-between flex-wrap gap-2 mt-3">
                            <button
                                className="btn btn-outline-dark"
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((index) => index - 1)}
                            >
                                ← Previous
                            </button>
                            {currentIndex < questions.length - 1 ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setCurrentIndex((index) => index + 1)}
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    className="btn btn-success"
                                    onClick={submitTest}
                                >
                                    Submit Test
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="container py-5">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h1 className="fw-bold">Interview Preparation Tests</h1>
                    <p className="text-secondary mb-0">
                        Choose a published interview test to begin.
                    </p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
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
                        <h4>No published interview tests yet</h4>
                        <p className="text-secondary mb-0">
                            Check back when an interview preparation test is published.
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
                                            Interview Preparation
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
                                            disabled={expired || isStartingTest}
                                            onClick={() => startTest(test)}
                                        >
                                            {expired
                                                ? "Test expired"
                                                : isStartingTest
                                                    ? "Loading test..."
                                                    : "Select and start test"}
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

export default InterviewPractice;

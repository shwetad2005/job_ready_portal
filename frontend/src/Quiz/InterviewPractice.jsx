
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import interviewQuestions from "../data/interviewQuestions";

function InterviewPractice() {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const question = interviewQuestions[currentIndex];

    const handleOptionSelect = (option) => {
        setSelectedAnswers((previous) => ({
            ...previous,
            [currentIndex]: option,
        }));
    };

    const handleSubmit = () => {
        const score = interviewQuestions.reduce(
            (total, item, index) =>
                total +
                (selectedAnswers[index] === item.answer ? 1 : 0),
            0
        );

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const percentage = Math.round(
            (score / interviewQuestions.length) * 100
        );

        const savedResults = JSON.parse(
            localStorage.getItem("weeklyScores") || "[]"
        );

        savedResults.push({
            id: Date.now(),
            name: user.fullName || "Unknown Student",
            fullName: user.fullName || "Unknown Student",
            email: user.email || "",
            category: "Interview",
            testName: "Interview Practice",
            score,
            total: interviewQuestions.length,
            percentage,
            date: new Date().toLocaleString(),
        });

        localStorage.setItem(
            "weeklyScores",
            JSON.stringify(savedResults)
        );

        navigate("/result", {
            state: {
                studentName: user.fullName || "Unknown Student",
                category: "Interview",
                score,
                total: interviewQuestions.length,
                percentage,
            },
        });
    };

    if (!question) {
        return <div className="container mt-5">No interview questions found.</div>;
    }

    return (
        <div className="container py-5">
            <div className="card shadow border-0">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between flex-wrap gap-2 mb-4">
                        <h3 className="fw-bold">Interview Practice 🎤</h3>
                        <span className="badge bg-primary fs-6">
                            Question {currentIndex + 1} / {interviewQuestions.length}
                        </span>
                    </div>

                    <div className="progress mb-4" style={{ height: "8px" }}>
                        <div
                            className="progress-bar"
                            style={{
                                width: `${((currentIndex + 1) / interviewQuestions.length) * 100}%`,
                            }}
                        />
                    </div>

                    <h5 className="mb-4">{question.question}</h5>

                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`btn w-100 text-start mb-3 p-3 ${
                                selectedAnswers[currentIndex] === option
                                    ? "btn-primary"
                                    : "btn-outline-secondary"
                            }`}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {String.fromCharCode(65 + index)}. {option}
                        </button>
                    ))}

                    <div className="d-flex justify-content-between flex-wrap gap-2 mt-3">
                        <button
                            className="btn btn-outline-dark"
                            disabled={currentIndex === 0}
                            onClick={() => setCurrentIndex((i) => i - 1)}
                        >
                            ← Previous
                        </button>

                        {currentIndex < interviewQuestions.length - 1 ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentIndex((i) => i + 1)}
                            >
                                Next →
                            </button>
                        ) : (
                            <button
                                className="btn btn-success"
                                onClick={handleSubmit}
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

export default InterviewPractice;

import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminResults() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [expandedAttemptId, setExpandedAttemptId] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get("/attempts");
                const sortedResults = [...response.data].sort(
                    (a, b) => Number(b.percentage) - Number(a.percentage)
                );
                setResults(sortedResults);
            } catch (error) {
                console.error("Error loading student test results:", error);
                setErrorMessage("Unable to load test results. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);


    // Performance calculate
    const getPerformance = (percentage) => {

        if (percentage >= 80) {
            return (
                <span className="badge bg-success">
                    Excellent
                </span>
            );
        }

        if (percentage >= 60) {
            return (
                <span className="badge bg-primary">
                    Good
                </span>
            );
        }

        if (percentage >= 40) {
            return (
                <span className="badge bg-warning text-dark">
                    Average
                </span>
            );
        }

        return (
            <span className="badge bg-danger">
                Needs Improvement
            </span>
        );
    };


    return (

        <div className="container mt-5 mb-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="fw-bold">
                        Test Results 📊
                    </h1>

                    <p className="text-secondary mb-0">
                        Monitor student performance across published tests.
                    </p>

                </div>


                <button
                    className="btn btn-dark"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    ← Admin Dashboard
                </button>

            </div>


            {/* Statistics */}

            <div className="row mb-4">

                <div className="col-md-4 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Total Attempts
                            </small>

                            <h2 className="fw-bold mt-2">
                                {results.length}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Highest Score
                            </small>

                            <h2 className="fw-bold mt-2 text-success">
{/* 
                                {results.length > 0
                                    ? results[0].percentage
                                    : "0%"} */}
                                    
{results.length > 0
    ? `${results[0].percentage}%`
    : "0%"}
                            </h2>

                        </div>

                    </div>

                </div>


                <div className="col-md-4 mb-3">

                    <div className="card shadow-sm border-0">

                        <div className="card-body">

                            <small className="text-secondary">
                                Top Student
                            </small>

                            <h5 className="fw-bold mt-2">

                                {results.length > 0
                                    ? results[0].name
                                    : "No Data"}

                            </h5>

                        </div>

                    </div>

                </div>

            </div>


            {errorMessage && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}

            {/* Results Table */}

            <div className="card shadow">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover text-center align-middle mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th>Rank</th>

                                    <th>Student</th>

                                    <th>Test</th>

                                    <th>Category</th>

                                    <th>Score</th>

                                    <th>Percentage</th>

                                    <th>Date</th>

                                    <th>Performance</th>

                                    <th>Submission</th>

                                </tr>

                            </thead>


                            <tbody>

                                {isLoading ? (
                                    <tr>
                                        <td colSpan="9" className="py-5 text-secondary">
                                            Loading test results...
                                        </td>
                                    </tr>
                                ) : results.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="py-5 text-secondary"
                                        >
                                            No test results available yet.
                                        </td>

                                    </tr>

                                ) : (

                                    results.map(
                                        (result, index) => (
                                            <Fragment key={result.id}>

                                            <tr>

                                                {/* Rank */}

                                                <td className="fw-bold">

                                                    {index === 0
                                                        ? "🥇"
                                                        : index === 1
                                                            ? "🥈"
                                                            : index === 2
                                                                ? "🥉"
                                                                : `#${index + 1}`}

                                                </td>


                                                {/* Student */}

                                                <td className="fw-semibold">

                                                    {result.name}

                                                </td>

                                                <td>{result.testName}</td>

                                                <td>{result.category}</td>


                                                {/* Score */}

                                                <td>

                                                    {result.score}
                                                    {" / "}
                                                    {result.total}

                                                </td>


                                                {/* Percentage */}

                                                <td className="fw-bold">

                                                    {result.percentage}%

                                                </td>

                                                <td>
                                                    {result.attemptedAt
                                                        ? new Date(result.attemptedAt).toLocaleString()
                                                        : "—"}
                                                </td>


                                                {/* Performance */}

                                                <td>

                                                    {getPerformance(
                                                        Number(result.percentage)
                                                    )}

                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary"
                                                        aria-expanded={expandedAttemptId === result.id}
                                                        onClick={() => setExpandedAttemptId(
                                                            expandedAttemptId === result.id
                                                                ? null
                                                                : result.id
                                                        )}
                                                    >
                                                        {expandedAttemptId === result.id
                                                            ? "Hide details"
                                                            : "View answers"}
                                                    </button>
                                                </td>

                                            </tr>

                                            {expandedAttemptId === result.id && (
                                                <tr key={`${result.id}-details`}>
                                                <td colSpan="9" className="text-start bg-light p-4">
                                                    <h5 className="fw-bold mb-3">
                                                        Submission details
                                                    </h5>
                                                    {!result.answers?.length ? (
                                                        <p className="text-secondary mb-0">
                                                            Answer details are unavailable for attempts submitted before detailed submissions were enabled.
                                                        </p>
                                                    ) : (
                                                        <div className="d-flex flex-column gap-3">
                                                            {result.answers.map((answer, answerIndex) => (
                                                                <article
                                                                    className={`card border-start border-4 ${
                                                                        answer.correct
                                                                            ? "border-success"
                                                                            : "border-danger"
                                                                    }`}
                                                                    key={`${result.id}-${answer.questionId}`}
                                                                >
                                                                    <div className="card-body">
                                                                        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                                                                            <h6 className="fw-bold mb-0">
                                                                                {answerIndex + 1}. {answer.questionText}
                                                                            </h6>
                                                                            <span className={`badge ${
                                                                                answer.correct
                                                                                    ? "bg-success"
                                                                                    : "bg-danger"
                                                                            }`}>
                                                                                {answer.correct ? "Correct" : "Incorrect"}
                                                                            </span>
                                                                        </div>
                                                                        <p className="mb-1">
                                                                            <strong>Student answer:</strong>{" "}
                                                                            {answer.selectedAnswer || (
                                                                                <span className="text-secondary fst-italic">
                                                                                    Not answered
                                                                                </span>
                                                                            )}
                                                                        </p>
                                                                        <p className="mb-1">
                                                                            <strong>Correct answer:</strong>{" "}
                                                                            <span className="text-success">
                                                                                {answer.correctAnswer || "Not provided"}
                                                                            </span>
                                                                        </p>
                                                                        <p className="small text-secondary mb-0">
                                                                            Marks: {answer.marksObtained ?? 0} / {answer.totalMarks ?? 0}
                                                                            {answer.explanation && ` · ${answer.explanation}`}
                                                                        </p>
                                                                    </div>
                                                                </article>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                </tr>
                                            )}

                                            </Fragment>
                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default AdminResults;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Leaderboard() {
    const navigate = useNavigate();

    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        setCurrentUser(user);

        const scores = JSON.parse(
            localStorage.getItem("weeklyScores") || "[]"
        );

        // Calculate percentage safely and rank highest percentage first
        const sortedResults = scores
            .map((student) => {
                const total = Number(student.total) || 0;
                const score = Number(student.score) || 0;

                const percentage =
                    student.percentage !== undefined &&
                    student.percentage !== null &&
                    student.percentage !== ""
                        ? Number(student.percentage)
                        : total > 0
                            ? Math.round((score / total) * 100)
                            : 0;

                return {
                    ...student,
                    score,
                    total,
                    percentage,
                    name:
                        student.name ||
                        student.fullName ||
                        "Unknown Student",
                };
            })
            .sort(
                (a, b) =>
                    b.percentage - a.percentage ||
                    b.score - a.score
            );

        setLeaderboard(sortedResults);
    }, []);

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold">🏆 Leaderboard</h1>
                <p className="lead text-secondary">
                    Check your ranking and compare your performance.
                </p>
            </div>

            {/* Top 3 students */}
            {leaderboard.length > 0 && (
                <div className="row justify-content-center mb-5">
                    {leaderboard.slice(0, 3).map((student, index) => (
                        <div className="col-md-4 mb-3" key={student.id ?? index}>
                            <div className="card shadow text-center h-100">
                                <div className="card-body p-4">
                                    <div className="display-4">
                                        {["🥇", "🥈", "🥉"][index]}
                                    </div>

                                    <h4 className="fw-bold mt-3">
                                        {student.name}
                                    </h4>

                                    <p className="mb-1">
                                        Score:{" "}
                                        <strong>
                                            {student.score} / {student.total}
                                        </strong>
                                    </p>

                                    <p className="text-success fw-bold">
                                        {student.percentage}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full leaderboard */}
            <div className="card shadow">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover text-center align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>Rank</th>
                                    <th>Student</th>
                                    <th>Test</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>

                            <tbody>
                                {leaderboard.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-5 text-secondary"
                                        >
                                            No test results available yet.
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((student, index) => {
                                        const isCurrentUser =
                                            currentUser?.email &&
                                            student.email &&
                                            currentUser.email.toLowerCase() ===
                                                student.email.toLowerCase();

                                        return (
                                            <tr
                                                key={student.id ?? index}
                                                className={
                                                    isCurrentUser
                                                        ? "table-primary fw-bold"
                                                        : ""
                                                }
                                            >
                                                <td className="fw-bold">
                                                    {index === 0
                                                        ? "🥇"
                                                        : index === 1
                                                            ? "🥈"
                                                            : index === 2
                                                                ? "🥉"
                                                                : `#${index + 1}`}
                                                </td>

                                                <td>
                                                    {student.name}
                                                    {isCurrentUser && (
                                                        <span className="badge bg-primary ms-2">
                                                            You
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {student.testName ||
                                                        student.category ||
                                                        "Test"}
                                                </td>

                                                <td>
                                                    {student.score} / {student.total}
                                                </td>

                                                <td className="fw-bold">
                                                    {student.percentage}%
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default Leaderboard;

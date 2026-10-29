
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Leaderboard() {
    const navigate = useNavigate();

    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [userRank, setUserRank] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const categories = [
        { value: "ALL", label: "All Categories" },
        { value: "APTITUDE", label: "Aptitude" },
        { value: "CODING", label: "Coding" },
        { value: "INTERVIEW_PREPARATION", label: "Interview Preparation" },
    ];

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
        setCurrentUser(user);
        fetchLeaderboard(selectedCategory, user);
    }, [selectedCategory]);

    const fetchLeaderboard = async (category, user) => {
        setIsLoading(true);
        try {
            let endpoint = "/attempts/leaderboard";
            if (category !== "ALL") {
                endpoint = `/attempts/leaderboard/category?category=${category}`;
            }

            const response = await api.get(endpoint);
            setLeaderboard(response.data);

            // Fetch user's rank if logged in
            if (user && category !== "ALL") {
                try {
                    const rankResponse = await api.get(
                        `/attempts/leaderboard/category/rank?category=${category}`
                    );
                    setUserRank(rankResponse.data);
                } catch (error) {
                    console.error("Failed to fetch user rank:", error);
                    setUserRank(null);
                }
            } else {
                setUserRank(null);
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
            // Fallback to localStorage
            const scores = JSON.parse(
                localStorage.getItem("weeklyScores") || "[]"
            );

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
        } finally {
            setIsLoading(false);
        }
    };

    const testWinners = [...leaderboard.reduce((winners, attempt) => {
        const attemptNumber = attempt.attemptNumber || 1;
        const winnerKey = `${attempt.testId}:${attemptNumber}`;
        if (attempt.testId && !winners.has(winnerKey)) {
            // The API ranks attempts by percentage, then time, then submission time.
            winners.set(winnerKey, attempt);
        }
        return winners;
    }, new Map()).values()];

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading leaderboard...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-5">
                <h1 className="fw-bold">🏆 Leaderboard</h1>
                <p className="lead text-secondary">
                    Check your ranking and compare your performance.
                </p>
            </div>

            {/* Category Filter */}
            <div className="card shadow-sm mb-4">
                <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="btn-group" role="group">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    className={`btn ${
                                        selectedCategory === cat.value
                                            ? "btn-primary"
                                            : "btn-outline-primary"
                                    }`}
                                    onClick={() => setSelectedCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* User's Rank Card */}
            {userRank && userRank.rank !== null && (
                <div className="card shadow-sm mb-4 border-primary">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold mb-1">Your Rank</h5>
                                <p className="text-secondary mb-0">
                                    Best score in {selectedCategory}
                                </p>
                            </div>
                            <div className="text-end">
                                <h2 className="fw-bold text-primary mb-0">
                                    #{userRank.rank}
                                </h2>
                                <p className="mb-0">
                                    {userRank.score} / {userRank.total} (
                                    {userRank.percentage}%)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Best attempt for each individual test */}
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
                                        {student.name || student.fullName || student.email || "Student"}
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
                                    <p className="small text-muted mb-0">
                                        Test {student.attemptNumber || 1}: {student.testName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <section className="mb-5" aria-labelledby="test-winners-title">
                <div className="mb-3">
                    <h2 id="test-winners-title" className="h4 fw-bold">Top performance by test</h2>
                    <p className="text-secondary mb-0">Each test attempt number has a winner: highest percentage, then fastest time, then earliest submission.</p>
                </div>
                <div className="row g-3">
                    {categories.filter((category) => category.value !== "ALL").map((category) => {
                        const categoryWinners = testWinners.filter((winner) => winner.category === category.value);
                        return (
                            <div className="col-12 col-md-4" key={category.value}>
                                <section className="card h-100 border-0 shadow-sm" aria-label={`${category.label} test winners`}>
                                    <div className="card-body">
                                        <h3 className="h5 fw-bold border-bottom pb-2">{category.label}</h3>
                                        <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                                            {categoryWinners.length === 0 ? (
                                                <p className="small text-secondary mb-0">No test results yet.</p>
                                            ) : categoryWinners.map((winner) => (
                                                <article className="border-bottom py-3" key={`${winner.testId}-${winner.attemptNumber || 1}`}>
                                                    <h4 className="h6 fw-bold">Test {winner.attemptNumber || 1}: {winner.testName || "Test"}</h4>
                                                    <p className="small mb-1">Winner: <strong>{winner.name || winner.fullName || winner.email || "Student"}</strong></p>
                                                    <p className="text-success fw-bold mb-0">{winner.score} / {winner.total} ({winner.percentage}%)</p>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        );
                    })}
                </div>
            </section>

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
                                                    {student.name || student.fullName || student.email || "Student"}
                                                    {isCurrentUser && (
                                                        <span className="badge bg-primary ms-2">
                                                            You
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    {student.testName
                                                        ? `Test ${student.attemptNumber || 1}: ${student.testName}`
                                                        :
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

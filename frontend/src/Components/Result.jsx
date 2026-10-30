// React Router Hook
import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    // Receive Data
    const location = useLocation();

    // Navigation
    const navigate = useNavigate();

    // Score
    const score = location.state?.score || 0;

    // Total Marks
    const total = location.state?.total || 0;
    const testName = location.state?.testName;
    const attemptNumber = location.state?.attemptNumber || 1;
    const category = location.state?.category;

    // Percentage
    const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : "0.00";

    // Determine grade
    const getGrade = (percentage) => {
        if (percentage >= 90) return { grade: "A+", color: "#10b981", bg: "#d1fae5" };
        if (percentage >= 80) return { grade: "A", color: "#22c55e", bg: "#dcfce7" };
        if (percentage >= 70) return { grade: "B", color: "#eab308", bg: "#fef9c3" };
        if (percentage >= 60) return { grade: "C", color: "#f97316", bg: "#ffedd5" };
        if (percentage >= 50) return { grade: "D", color: "#ef4444", bg: "#fee2e2" };
        return { grade: "F", color: "#dc2626", bg: "#fecaca" };
    };

    const gradeInfo = getGrade(parseFloat(percentage));

    return (

        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                        {/* Header with gradient */}
                        <div 
                            className="card-body p-5 text-center"
                            style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white"
                            }}
                        >
                            <div style={{ fontSize: "60px", marginBottom: "20px" }}>
                                🎉
                            </div>
                            <h1 className="fw-bold mb-2">Test Completed!</h1>
                            {testName && (
                                <p className="mb-0" style={{ opacity: 0.9 }}>
                                    Test {attemptNumber}: {testName}{category ? ` · ${category}` : ""}
                                </p>
                            )}
                        </div>

                        {/* Score Display */}
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <div 
                                    className="d-inline-block px-4 py-2 rounded-3 mb-3"
                                    style={{ 
                                        background: gradeInfo.bg,
                                        color: gradeInfo.color,
                                        fontSize: "24px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Grade: {gradeInfo.grade}
                                </div>
                            </div>

                            <div className="row g-4 mb-4">
                                <div className="col-6">
                                    <div 
                                        className="p-4 rounded-3 text-center"
                                        style={{ background: "#f8f9fa" }}
                                    >
                                        <p className="text-secondary mb-1 small">Your Score</p>
                                        <h2 className="fw-bold mb-0" style={{ color: "#667eea" }}>
                                            {score}
                                        </h2>
                                        <small className="text-secondary">out of {total}</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div 
                                        className="p-4 rounded-3 text-center"
                                        style={{ background: "#f8f9fa" }}
                                    >
                                        <p className="text-secondary mb-1 small">Percentage</p>
                                        <h2 className="fw-bold mb-0" style={{ color: "#764ba2" }}>
                                            {percentage}%
                                        </h2>
                                        <small className="text-secondary">accuracy</small>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div 
                                    className="progress"
                                    style={{ height: "12px", borderRadius: "6px", background: "#e9ecef" }}
                                >
                                    <div 
                                        className="progress-bar"
                                        style={{
                                            width: `${percentage}%`,
                                            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                                            borderRadius: "6px",
                                            transition: "width 0.5s ease"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 justify-content-center">
                                <button
                                    className="btn btn-primary px-4 py-2"
                                    style={{ borderRadius: "12px", fontWeight: "500" }}
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Back to Dashboard
                                </button>
                                <button
                                    className="btn btn-success px-4 py-2"
                                    style={{ borderRadius: "12px", fontWeight: "500" }}
                                    onClick={() => navigate("/leaderboard")}
                                >
                                    View Leaderboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Result;

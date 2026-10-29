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

    return (

        <div className="container mt-5">

            <div className="card shadow p-5 text-center">

                <h1>🎉 Test Completed</h1>

                {testName && (
                    <p className="text-secondary mt-3">
                        Test {attemptNumber}: {testName}{category ? ` · ${category}` : ""}
                    </p>
                )}

                <h3 className="mt-4">
                    Score : {score} / {total}
                </h3>

                <h4>
                    Percentage : {percentage}%
                </h4>

                <div className="mt-4 d-flex justify-content-center gap-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back To Dashboard
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/leaderboard")}
                    >
                        View Leaderboard
                    </button>
                </div>

            </div>

        </div>

    );
}

export default Result;

// React Router Hook
import { useLocation, useNavigate } from "react-router-dom";

function Result() {

    // Receive Data
    const location = useLocation();

    // Navigation
    const navigate = useNavigate();

    // Score
    const score = location.state.score;

    // Total Questions
    const total = location.state.total;

    // Percentage
    const percentage = ((score / total) * 100).toFixed(2);

    return (

        <div className="container mt-5">

            <div className="card shadow p-5 text-center">

                <h1>🎉 Test Completed</h1>

                <h3 className="mt-4">
                    Score : {score} / {total}
                </h3>

                <h4>
                    Percentage : {percentage}%
                </h4>

                <button
                    className="btn btn-primary mt-4"
                    onClick={() => navigate("/dashboard")}
                >
                    Back To Dashboard
                </button>

            </div>

        </div>

    );
}

export default Result;
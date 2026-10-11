import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function WeeklyResult() {

    const location = useLocation();
    const navigate = useNavigate();

    const score = location.state?.score || 0;
    const total = location.state?.total || 0;

    const percentage =
        total > 0
            ? ((score / total) * 100).toFixed(2)
            : "0.00";

    const [rank, setRank] = useState(null);

    useEffect(() => {

        const user =
            JSON.parse(localStorage.getItem("user"));

        const studentName =
            user?.fullName || "Student";

        const existingScores =
            JSON.parse(
                localStorage.getItem("weeklyScores")
            ) || [];

        const newResult = {
            name: studentName,
            score: score,
            total: total,
            percentage: Number(percentage),
        };

        // Same student's previous result remove करा
        const filteredScores =
            existingScores.filter(
                (result) =>
                    result.name !== studentName
            );

        const updatedScores = [
            ...filteredScores,
            newResult
        ];

        // Score नुसार ranking
        const sortedScores =
            [...updatedScores].sort(
                (a, b) =>
                    b.score - a.score ||
                    b.percentage - a.percentage
            );

        const studentRank =
            sortedScores.findIndex(
                (result) =>
                    result.name === studentName
            ) + 1;

        setRank(studentRank);

        localStorage.setItem(
            "weeklyScores",
            JSON.stringify(updatedScores)
        );

    }, [score, total, percentage]);


    return (

        <div className="container mt-5 mb-5">

            <div className="row justify-content-center">

                <div className="col-md-7">

                    <div className="card shadow-lg border-0">

                        <div className="card-body p-5 text-center">

                            <h1 className="fw-bold">
                                🎉 Test Completed!
                            </h1>

                            <p className="lead text-secondary mt-3">
                                Great job! Here is your weekly test performance.
                            </p>


                            {/* Score */}

                            <div className="mt-4">

                                <h3 className="fw-bold">
                                    Score
                                </h3>

                                <h1 className="display-4 fw-bold text-primary">
                                    {score} / {total}
                                </h1>

                            </div>


                            {/* Percentage */}

                            <div className="mt-4">

                                <h5 className="text-secondary">
                                    Percentage
                                </h5>

                                <h2 className="fw-bold text-success">
                                    {percentage}%
                                </h2>

                            </div>


                            {/* Rank */}

                            <div className="mt-4">

                                <h5 className="text-secondary">
                                    Your Rank
                                </h5>

                                <h2 className="fw-bold">
                                    🏆 #{rank}
                                </h2>

                            </div>


                            {/* Buttons */}

                            <div className="mt-5">

                                <button
                                    className="btn btn-primary me-2"
                                    onClick={() =>
                                        navigate("/leaderboard")
                                    }
                                >
                                    🏆 View Leaderboard
                                </button>

                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        navigate("/dashboard")
                                    }
                                >
                                    ← Dashboard
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default WeeklyResult;
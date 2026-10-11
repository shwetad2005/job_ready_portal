import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminResults() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);

    useEffect(() => {

        const savedResults =
            JSON.parse(
                localStorage.getItem("weeklyScores")
            ) || [];

        // Score + percentage नुसार ranking
      const sortedResults =
    [...savedResults].sort(
        (a, b) =>
            Number(b.percentage || 0) -
            Number(a.percentage || 0)
    );

        setResults(sortedResults);

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
                        Monitor student weekly test performance.
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


            {/* Results Table */}

            <div className="card shadow">

                <div className="card-body p-0">

                    <div className="table-responsive">

                        <table className="table table-hover text-center align-middle mb-0">

                            <thead className="table-dark">

                                <tr>

                                    <th>Rank</th>

                                    <th>Student</th>

                                    <th>Score</th>

                                    <th>Percentage</th>

                                    <th>Performance</th>

                                </tr>

                            </thead>


                            <tbody>

                                {results.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="py-5 text-secondary"
                                        >
                                            No test results available yet.
                                        </td>

                                    </tr>

                                ) : (

                                    results.map(
                                        (result, index) => (

                                            <tr key={index}>

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


                                                {/* Performance */}

                                                <td>

                                                    {getPerformance(
                                                        Number(result.percentage)
                                                    )}

                                                </td>

                                            </tr>

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
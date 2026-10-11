import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminWeeklyTest() {

    const navigate = useNavigate();

    const defaultTest = {
        title: "Weekly Placement Test",
        duration: 30,
        questionLimit: 10,
        active: true,
    };

    const [test, setTest] = useState(defaultTest);

    useEffect(() => {

        const savedTest =
            JSON.parse(
                localStorage.getItem("weeklyTestSettings")
            );

        if (savedTest) {
            setTest(savedTest);
        }

    }, []);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setTest({
            ...test,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });

    };

    const handleSave = (e) => {

        e.preventDefault();

        if (
            !test.title ||
            test.duration <= 0 ||
            test.questionLimit <= 0
        ) {

            alert("Please enter valid test details.");

            return;
        }

        localStorage.setItem(
            "weeklyTestSettings",
            JSON.stringify(test)
        );

        alert("Weekly Test settings saved successfully ✅");

    };

    return (
        <div className="container mt-5 mb-5">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="fw-bold">
                        Weekly Test Management 📝
                    </h1>

                    <p className="text-secondary mb-0">
                        Create and manage the weekly placement test.
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


            {/* Test Settings */}

            <div className="card shadow mb-4">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                        Test Settings
                    </h4>

                    <form onSubmit={handleSave}>

                        {/* Title */}

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Test Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={test.title}
                                onChange={handleChange}
                                placeholder="Enter test title"
                            />

                        </div>


                        <div className="row">

                            {/* Duration */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-semibold">
                                    Duration (Minutes)
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="duration"
                                    min="1"
                                    value={test.duration}
                                    onChange={handleChange}
                                />

                            </div>


                            {/* Question Limit */}

                            <div className="col-md-6 mb-3">

                                <label className="form-label fw-semibold">
                                    Number of Questions
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="questionLimit"
                                    min="1"
                                    value={test.questionLimit}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* Active */}

                        <div className="form-check form-switch mb-4">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="active"
                                checked={test.active}
                                onChange={handleChange}
                                id="testActive"
                            />

                            <label
                                className="form-check-label fw-semibold"
                                htmlFor="testActive"
                            >
                                Publish Weekly Test
                            </label>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Save Test Settings
                        </button>

                    </form>

                </div>

            </div>


            {/* Current Settings */}

            <div className="card shadow-sm">

                <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                        Current Test
                    </h4>

                    <div className="row">

                        <div className="col-md-3 mb-3">

                            <div className="border rounded p-3">

                                <small className="text-secondary">
                                    Title
                                </small>

                                <h6 className="fw-bold mt-2">
                                    {test.title}
                                </h6>

                            </div>

                        </div>


                        <div className="col-md-3 mb-3">

                            <div className="border rounded p-3">

                                <small className="text-secondary">
                                    Duration
                                </small>

                                <h6 className="fw-bold mt-2">
                                    {test.duration} Minutes
                                </h6>

                            </div>

                        </div>


                        <div className="col-md-3 mb-3">

                            <div className="border rounded p-3">

                                <small className="text-secondary">
                                    Questions
                                </small>

                                <h6 className="fw-bold mt-2">
                                    {test.questionLimit}
                                </h6>

                            </div>

                        </div>


                        <div className="col-md-3 mb-3">

                            <div className="border rounded p-3">

                                <small className="text-secondary">
                                    Status
                                </small>

                                <h6 className="fw-bold mt-2">

                                    {test.active
                                        ? "🟢 Active"
                                        : "🔴 Inactive"}

                                </h6>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminWeeklyTest;
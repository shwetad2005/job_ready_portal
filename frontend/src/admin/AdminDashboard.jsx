
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const [students, setStudents] = useState(0);
    const [topStudent, setTopStudent] = useState(null);

    // =========================================
    // LOAD DASHBOARD DATA
    // =========================================
    useEffect(() => {
        // REGISTERED STUDENTS
        let registeredUsers =
            JSON.parse(localStorage.getItem("users") || "[]");

        const currentUser =
            JSON.parse(localStorage.getItem("user") || "null");

        if (currentUser?.email) {
            const alreadyExists = registeredUsers.some(
                (student) =>
                    student.email?.toLowerCase() ===
                    currentUser.email.toLowerCase()
            );

            if (!alreadyExists) {
                registeredUsers.push(currentUser);

                localStorage.setItem(
                    "users",
                    JSON.stringify(registeredUsers)
                );
            }
        }

        setStudents(registeredUsers.length);

        // =========================================
        // TOP PERFORMER - HIGHEST PERCENTAGE
        // =========================================
        const savedResults =
            JSON.parse(localStorage.getItem("weeklyScores") || "[]");

        if (savedResults.length > 0) {
            const sortedResults = savedResults
                .map((result) => {
                    const score = Number(result.score) || 0;
                    const total = Number(result.total) || 0;

                    const percentage =
                        result.percentage !== undefined &&
                        result.percentage !== null &&
                        result.percentage !== ""
                            ? Number(result.percentage)
                            : total > 0
                                ? Math.round((score / total) * 100)
                                : 0;

                    return {
                        ...result,
                        score,
                        total,
                        percentage,
                        name:
                            result.name ||
                            result.fullName ||
                            "Unknown Student",
                    };
                })
                .sort(
                    (a, b) =>
                        b.percentage - a.percentage ||
                        b.score - a.score
                );

            setTopStudent(sortedResults[0]);
        } else {
            setTopStudent(null);
        }
    }, []);

    // =========================================
    // LOGOUT
    // =========================================
    const handleLogout = () => {
        localStorage.removeItem("admin");

        alert("Admin Logout Successful");

        navigate("/admin/login");
    };

    // =========================================
    // REUSABLE CARD STYLE
    // =========================================
    const overviewCardStyle = {
        background: "white",
        borderRadius: "20px",
        border: "1px solid #e9eaf2",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
        transition: "all 0.3s ease",
    };

    const managementCardStyle = {
        ...overviewCardStyle,
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
        cursor: "pointer",
    };

    const handleCardEnter = (event) => {
        event.currentTarget.style.transform = "translateY(-6px)";
        event.currentTarget.style.boxShadow =
            "0 15px 30px rgba(79,70,229,0.15)";
    };

    const handleCardLeave = (event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow =
            "0 8px 25px rgba(0,0,0,0.06)";
    };

    const managementCards = [
        {
            title: "Manage Students",
            description:
                "View registered students and their test performance.",
            icon: "👥",
            iconBg: "#eef2ff",
            button: "View Students →",
            buttonClass: "btn-primary",
            path: "/admin/users",
        },
        {
            title: "Manage Questions",
            description:
                "Add, edit and manage aptitude, coding and interview questions.",
            icon: "❓",
            iconBg: "#ecfdf5",
            button: "Manage Questions →",
            buttonClass: "btn-success",
            path: "/admin/questions",
        },
        {
            title: "Test Results",
            description:
                "Monitor student scores and test performance.",
            icon: "📊",
            iconBg: "#ecfeff",
            button: "View Results →",
            buttonClass: "btn-info text-white",
            path: "/admin/results",
        },
        {
            title: "Leaderboard",
            description:
                "View rankings and top performing students.",
            icon: "🏆",
            iconBg: "#fffbeb",
            button: "View Leaderboard →",
            buttonClass: "btn-dark",
            path: "/leaderboard",
        },
        {
            title: "Student Panel",
            description:
                "Preview the student dashboard and user experience.",
            icon: "🎓",
            iconBg: "#f1f5f9",
            button: "Open Student Panel →",
            buttonClass: "btn-secondary",
            path: "/dashboard",
        },
    ];

    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f5f7ff 0%, #eef2ff 50%, #f8f9fa 100%)",
                paddingBottom: "60px",
            }}
        >
            <div className="container pt-4">
                {/* HEADER */}
                <div
                    className="p-4 p-md-5 mb-4"
                    style={{
                        background:
                            "linear-gradient(135deg, #4f46e5, #6366f1, #7c3aed)",
                        borderRadius: "24px",
                        color: "white",
                        boxShadow:
                            "0 15px 35px rgba(79, 70, 229, 0.25)",
                    }}
                >
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                        <div>
                            <div
                                className="mb-2"
                                style={{
                                    fontSize: "14px",
                                    opacity: 0.85,
                                    letterSpacing: "0.5px",
                                }}
                            >
                                ADMIN PANEL
                            </div>

                            <h1
                                className="fw-bold mb-2"
                                style={{
                                    fontSize: "clamp(28px, 5vw, 42px)",
                                }}
                            >
                                Welcome back, Admin 👋
                            </h1>

                            <p
                                className="mb-0"
                                style={{ opacity: 0.9, fontSize: "16px" }}
                            >
                                Manage students, questions and monitor
                                placement performance.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn btn-light fw-semibold px-4 py-2"
                            style={{ borderRadius: "12px", whiteSpace: "nowrap" }}
                        >
                            Logout ↪
                        </button>
                    </div>
                </div>

                {/* OVERVIEW */}
                <div className="mb-3">
                    <h3 className="fw-bold mb-1">Overview</h3>
                    <p className="text-secondary mb-0">
                        Quick summary of student performance
                    </p>
                </div>

                <div className="row g-4 mb-5">
                    {/* REGISTERED STUDENTS */}
                    <div className="col-md-6">
                        <div
                            className="h-100 p-4"
                            style={overviewCardStyle}
                            onMouseEnter={handleCardEnter}
                            onMouseLeave={handleCardLeave}
                        >
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-flex align-items-center justify-content-center me-4"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "18px",
                                        background:
                                            "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                                        fontSize: "34px",
                                        flexShrink: 0,
                                    }}
                                >
                                    👨‍🎓
                                </div>

                                <div>
                                    <p
                                        className="text-secondary mb-1"
                                        style={{ fontSize: "14px" }}
                                    >
                                        REGISTERED STUDENTS
                                    </p>

                                    <h2
                                        className="fw-bold mb-1"
                                        style={{ fontSize: "36px" }}
                                    >
                                        {students}
                                    </h2>

                                    <small className="text-secondary">
                                        Students registered in portal
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TOP PERFORMER */}
                    <div className="col-md-6">
                        <div
                            className="h-100 p-4"
                            style={overviewCardStyle}
                            onMouseEnter={handleCardEnter}
                            onMouseLeave={handleCardLeave}
                        >
                            <div className="d-flex align-items-center">
                                <div
                                    className="d-flex align-items-center justify-content-center me-4"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        borderRadius: "18px",
                                        background:
                                            "linear-gradient(135deg, #fef3c7, #fde68a)",
                                        fontSize: "34px",
                                        flexShrink: 0,
                                    }}
                                >
                                    🏆
                                </div>

                                <div>
                                    <p
                                        className="text-secondary mb-1"
                                        style={{ fontSize: "14px" }}
                                    >
                                        TOP PERFORMER
                                    </p>

                                    <h4
                                        className="fw-bold mb-1"
                                        style={{ fontSize: "24px" }}
                                    >
                                        {topStudent?.name || "No Data"}
                                    </h4>

                                    <p className="text-success fw-bold mb-1">
                                        {topStudent
                                            ? `${topStudent.percentage}%`
                                            : "No Results Yet"}
                                    </p>

                                    <small className="text-secondary">
                                        {topStudent
                                            ? `Highest performance · ${topStudent.score}/${topStudent.total} marks`
                                            : "No test results available yet"}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MANAGEMENT */}
                <div className="mb-4">
                    <h3 className="fw-bold mb-1">Management</h3>
                    <p className="text-secondary">
                        Manage and monitor your placement portal
                    </p>
                </div>

                <div className="row g-4">
                    {managementCards.map((card) => (
                        <div
                            className="col-md-6 col-lg-4"
                            key={card.title}
                        >
                            <div
                                className="h-100 p-4"
                                style={managementCardStyle}
                                onMouseEnter={handleCardEnter}
                                onMouseLeave={handleCardLeave}
                                onClick={() => navigate(card.path)}
                            >
                                <div
                                    className="d-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "16px",
                                        background: card.iconBg,
                                        fontSize: "30px",
                                    }}
                                >
                                    {card.icon}
                                </div>

                                <h4 className="fw-bold">{card.title}</h4>

                                <p className="text-secondary">
                                    {card.description}
                                </p>

                                <button
                                    className={`btn ${card.buttonClass} px-4`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        navigate(card.path);
                                    }}
                                >
                                    {card.button}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const performanceCategories = [
    { value: "APTITUDE", label: "Aptitude" },
    { value: "CODING", label: "Coding" },
    { value: "INTERVIEW_PREPARATION", label: "Interview" },
];

function AdminDashboard() {
    const navigate = useNavigate();

    const [students, setStudents] = useState(null);
    const [studentsError, setStudentsError] = useState("");
    const [topPerformances, setTopPerformances] = useState([]);

    // =========================================
    // LOAD DASHBOARD DATA
    // =========================================
    useEffect(() => {
        let isMounted = true;
        api.get("/users/students")
            .then((response) => {
                if (isMounted) {
                    // response.data is an array of students
                    setStudents(Array.isArray(response.data) ? response.data.length : 0);
                }
            })
            .catch((error) => {
                console.error("Unable to load registered student count:", error);
                if (isMounted) {
                    if (error.response?.status === 403) {
                        setStudentsError("Access denied. Please login as admin.");
                    } else {
                        setStudentsError("Unable to load student count.");
                    }
                }
            });

        api.get("/attempts/leaderboard")
            .then((response) => {
                if (!isMounted) return;
                const winners = new Map();
                response.data.forEach((attempt) => {
                    const key = `${attempt.testId}:${attempt.attemptNumber || 1}`;
                    if (attempt.testId && !winners.has(key)) winners.set(key, attempt);
                });
                setTopPerformances([...winners.values()]);
            })
            .catch((error) => {
                console.error("Unable to load test winners:", error);
                if (isMounted) setTopPerformances([]);
            });
        return () => { isMounted = false; };
    }, []);

    // =========================================
    // LOGOUT
    // =========================================
    const handleLogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("user");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("isLoggedIn");
        navigate("/admin/login", { replace: true });
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
            title: "Manage Learning Paths",
            description: "Write aptitude, coding, and interview lessons, then link them to subject tests.",
            icon: "📚",
            iconBg: "#eff6ff",
            button: "Manage Learning Paths →",
            buttonClass: "btn-primary",
            path: "/admin/courses",
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
            title: "Exam Support",
            description: "Review student exam complaints and update ticket status.",
            icon: "🎫",
            iconBg: "#fff7ed",
            button: "View Tickets →",
            buttonClass: "btn-warning",
            path: "/admin/tickets",
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
        <div className="admin-dashboard-page"
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
                    className="admin-dashboard-hero p-4 p-md-5 mb-4"
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
                            className="admin-overview-card h-100 p-4"
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
                                        {students === null ? "—" : students}
                                    </h2>

                                    <small className="text-secondary">
                                        {studentsError || "Students registered in portal"}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TOP PERFORMANCE BY TEST */}
                    <div className="col-md-6">
                        <div
                            className="admin-overview-card h-100 p-4"
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

                                <div className="flex-grow-1">
                                    <p
                                        className="text-secondary mb-1"
                                        style={{ fontSize: "14px" }}
                                    >
                                        TOP PERFORMANCE BY TEST
                                    </p>
                                    <small className="text-secondary d-block mb-2">Best percentage per test attempt; ties go to faster, earlier attempts.</small>
                                    <div className="row g-2">
                                        {performanceCategories.map((category) => {
                                            const categoryWinners = topPerformances.filter((winner) => winner.category === category.value);
                                            return (
                                                <div className="col-12 col-sm-4" key={category.value}>
                                                    <section className="h-100 p-2 rounded border bg-light" aria-label={`${category.label} test winners`}>
                                                        <h5 className="small fw-bold mb-2 text-truncate">{category.label}</h5>
                                                        <div style={{ maxHeight: "170px", overflowY: "auto" }}>
                                                            {categoryWinners.length === 0 ? (
                                                                <small className="text-secondary">No results yet.</small>
                                                            ) : categoryWinners.map((winner) => (
                                                                <div className="border-top py-2" key={`${winner.testId}-${winner.attemptNumber || 1}`}>
                                                                    <strong className="d-block small text-break">Test {winner.attemptNumber || 1}: {winner.testName}</strong>
                                                                    <small className="text-secondary d-block text-break">{winner.name || winner.fullName || winner.email || "Student"}</small>
                                                                    <small className="text-success fw-bold">{winner.percentage}%</small>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>
                                                </div>
                                            );
                                        })}
                                    </div>
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
                                className="admin-management-card h-100 p-4"
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

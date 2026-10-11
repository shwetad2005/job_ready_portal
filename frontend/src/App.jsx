import { Routes, Route } from "react-router-dom";

import Layout from "./Components/LAyout";

import Home from "./Components/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import Dashboard from "./Components/Dashboard";

import Aptitude from "./page/Aptitude";
import Coding from "./page/Coding";
import Interview from "./page/Interview";
import Progress from "./page/Progress";

import Quantitative from "./Quiz/Quantitative";
import Logical from "./Quiz/Logical";
import Verbal from "./Quiz/Verbal";
import CodingPractice from "./Quiz/CodingPractice";
import InterviewPractice from "./Quiz/InterviewPractice";

import Result from "./Components/Result";

import WeeklyTest from "./page/weeklyTest";
import WeeklyResult from "./page/weeklyResult";
import Leaderboard from "./page/Leaderboard";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import AdminUsers from "./admin/AdminUsers";
import AdminQuestions from "./admin/AdminQuestions";
import AdminWeeklyTest from "./admin/AdminWeeklyTest";
import AdminResults from "./admin/AdminResults";

import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
    return (
        <Layout>

            <Routes>

                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= PUBLIC PAGES ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================= INFORMATION PAGES ================= */}

                <Route
                    path="/aptitude"
                    element={<Aptitude />}
                />

                <Route
                    path="/coding"
                    element={<Coding />}
                />

                <Route
                    path="/interview"
                    element={<Interview />}
                />


                {/* ================= STUDENT DASHBOARD ================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute>
                            <Progress />
                        </ProtectedRoute>
                    }
                />


                {/* ================= APTITUDE PRACTICE ================= */}

                <Route
                    path="/quantitative"
                    element={
                        <ProtectedRoute>
                            <Quantitative />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/logical"
                    element={
                        <ProtectedRoute>
                            <Logical />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/verbal"
                    element={
                        <ProtectedRoute>
                            <Verbal />
                        </ProtectedRoute>
                    }
                />


                {/* ================= NORMAL RESULT ================= */}

                <Route
                    path="/result"
                    element={
                        <ProtectedRoute>
                            <Result />
                        </ProtectedRoute>
                    }
                />


                {/* ================= WEEKLY TEST ================= */}

                <Route
                    path="/weekly-test"
                    element={
                        <ProtectedRoute>
                            <WeeklyTest />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/weekly-result"
                    element={
                        <ProtectedRoute>
                            <WeeklyResult />
                        </ProtectedRoute>
                    }
                />


                {/* ================= LEADERBOARD ================= */}

                <Route
                    path="/leaderboard"
                    element={
                        <ProtectedRoute>
                            <Leaderboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================= ADMIN ================= */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminProtectedRoute>
                            <AdminUsers />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/questions"
                    element={
                        <AdminProtectedRoute>
                            <AdminQuestions />
                        </AdminProtectedRoute>
                    }
                />
<Route
    path="/admin/weekly-test"
    element={
        <AdminProtectedRoute>
            <AdminWeeklyTest />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/admin/results"
    element={
        <AdminProtectedRoute>
            <AdminResults />
        </AdminProtectedRoute>
    }
/>

<Route
    path="/coding-practice"
    element={
        <ProtectedRoute>
            <CodingPractice />
        </ProtectedRoute>
    }
/>

<Route
    path="/interview-practice"
    element={
        <ProtectedRoute>
            <InterviewPractice />
        </ProtectedRoute>
    }
/>
            </Routes>

        </Layout>
    );
}

export default App;
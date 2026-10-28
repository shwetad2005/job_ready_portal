import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            const response = await api.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password
            });
            const { user, token } = response.data;

            if (user.role !== "ROLE_ADMIN") {
                setErrorMessage("This account does not have administrator access.");
                return;
            }

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem(
                "admin",
                JSON.stringify({ ...user, role: "admin" })
            );
            sessionStorage.setItem("authToken", token);
            sessionStorage.setItem("isLoggedIn", "true");
            navigate("/admin/dashboard");
        } catch (error) {
            if (error.response?.status === 401) {
                setErrorMessage("Invalid email or password.");
            } else if (error.response) {
                setErrorMessage(
                    `The server couldn't complete your sign-in (error ${error.response.status}).`
                );
            } else {
                setErrorMessage(
                    "Can't connect to the sign-in server. Check that the backend is running."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow p-4">

                        <h2 className="text-center fw-bold mb-2">
                            Admin Login 👨‍💼
                        </h2>

                        <p className="text-center text-secondary mb-4">
                            Login to manage JobReady
                        </p>

                        <form onSubmit={handleLogin}>

                            <div className="mb-3">

                                <label className="form-label fw-semibold">
                                    Admin Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter admin email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label fw-semibold">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter admin password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />

                            </div>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Login as Admin"}
                            </button>

                        </form>

                        <div className="alert alert-info mt-4 mb-0">
                            Sign in with an administrator account to manage JobReady.
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminLogin;
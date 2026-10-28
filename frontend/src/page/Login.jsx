import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

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

            localStorage.setItem("user", JSON.stringify(response.data.user));
            sessionStorage.setItem("authToken", response.data.token);
            sessionStorage.setItem("isLoggedIn", "true");

            const redirectTo = response.data.user.role === "ROLE_ADMIN"
                ? "/admin/dashboard"
                : location.state?.redirectTo || "/dashboard";
            navigate(redirectTo, { replace: true });
        } catch (error) {
            if (error.response?.status === 401) {
                setErrorMessage("Invalid email or password.");
            } else if (error.response?.status === 400) {
                setErrorMessage("Please enter a valid email and password.");
            } else if (error.response) {
                setErrorMessage(
                    `The server couldn't complete your sign-in (error ${error.response.status}). Please try again.`
                );
            } else {
                setErrorMessage(
                    "Can't connect to the sign-in server. Check that the backend is running and try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow p-4">

                        <h2 className="text-center fw-bold mb-4">
                            Login
                        </h2>

                        <form onSubmit={handleLogin}>

                            {/* EMAIL */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="email"
                                    required
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
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

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Login"}
                            </button>

                        </form>


                        {/* REGISTER */}

                        <p className="text-center mt-4 mb-0">

                            Don't have an account?{" "}

                            <Link to="/register">
                                Register
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;
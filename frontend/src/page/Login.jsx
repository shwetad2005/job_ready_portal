import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSendingOtp(true);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            setIsSendingOtp(false);
            return;
        }

        try {
            const response = await api.post("/auth/send-otp", { email });
            setSuccessMessage("OTP sent to your email! (Check console for demo)");
            console.log("OTP:", response.data.otp);
        } catch (error) {
            if (error.response?.status === 404) {
                setErrorMessage("User not found. Please register first.");
            } else {
                setErrorMessage("Failed to send OTP. Please try again.");
            }
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            setIsSubmitting(false);
            return;
        }

        // OTP validation - required
        if (!otp || otp.trim().length !== 6) {
            setErrorMessage("Please enter the 6-digit OTP sent to your email.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await api.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password,
                otp
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
                setErrorMessage("Invalid email, password, or OTP.");
            } else if (error.response?.status === 400) {
                setErrorMessage("OTP is required. Please enter the OTP sent to your email.");
            } else if (error.response) {
                setErrorMessage(
                    `Server error: ${error.response.status}. Please try again.`
                );
            } else {
                setErrorMessage(
                    "Can't connect to the server. Check that the backend is running."
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

                    <div className="card shadow p-4" style={{ borderRadius: "20px", border: "none" }}>

                        <h2 className="text-center fw-bold mb-4">
                            Login
                        </h2>

                        <form onSubmit={handleLogin}>

                            {/* EMAIL */}

                            <div className="mb-3">

                                <label className="form-label fw-semibold">
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
                                    style={{ borderRadius: "12px" }}
                                />

                            </div>

                            {/* PASSWORD */}

                            <div className="mb-3">

                                <label className="form-label fw-semibold">
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
                                    style={{ borderRadius: "12px" }}
                                />

                            </div>

                            {/* OTP Section - Required */}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    OTP <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value)
                                        }
                                        maxLength={6}
                                        required
                                        style={{ borderRadius: "12px 0 0 12px" }}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={handleSendOtp}
                                        disabled={isSendingOtp || !email}
                                        style={{ borderRadius: "0 12px 12px 0" }}
                                    >
                                        {isSendingOtp ? "Sending..." : "Send OTP"}
                                    </button>
                                </div>
                                <small className="text-muted mt-1 d-block">
                                    OTP is required for login. Click "Send OTP" to receive your code.
                                </small>
                            </div>

                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="btn btn-primary w-100 py-2"
                                disabled={isSubmitting}
                                style={{ borderRadius: "12px", fontWeight: "500" }}
                            >
                                {isSubmitting ? "Signing in..." : "Login"}
                            </button>

                        </form>


                        {/* REGISTER */}

                        <p className="text-center mt-4 mb-0">

                            Don't have an account?{" "}

                            <Link to="/register" className="fw-semibold">
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

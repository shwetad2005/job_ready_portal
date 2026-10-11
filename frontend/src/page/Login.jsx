import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        // Get all registered users
        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        // Remove extra spaces and make email lowercase
        const enteredEmail =
            email.trim().toLowerCase();

        const enteredPassword =
            password;

        // Find matching user
        const loggedInUser = users.find(
            (user) =>
                user.email?.trim().toLowerCase() ===
                    enteredEmail &&
                user.password === enteredPassword
        );

        // User not found
        if (!loggedInUser) {

            alert("Invalid Email or Password.");

            return;
        }

        // Save currently logged-in user
        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        // Login session
        sessionStorage.setItem(
            "isLoggedIn",
            "true"
        );

        alert("Login Successful 🎉");

        // Redirect to requested page
        const redirectTo =
            location.state?.redirectTo ||
            "/dashboard";

        navigate(redirectTo);

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
                                    required
                                />

                            </div>


                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Login
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
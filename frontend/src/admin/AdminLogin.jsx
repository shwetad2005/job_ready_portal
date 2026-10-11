import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        // Demo admin credentials
        const adminEmail = "admin@jobready.com";
        const adminPassword = "admin123";

        if (
            email === adminEmail &&
            password === adminPassword
        ) {

            // Admin login information save
            localStorage.setItem(
                "admin",
                JSON.stringify({
                    email: adminEmail,
                    role: "admin"
                })
            );

            alert("Admin Login Successful 🎉");

            navigate("/admin/dashboard");

        } else {

            alert("Invalid Admin Email or Password ❌");

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
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-dark w-100"
                            >
                                Login as Admin
                            </button>

                        </form>

                        <div className="alert alert-info mt-4 mb-0">
                            <strong>Demo Login:</strong>
                            <br />
                            Email: admin@jobready.com
                            <br />
                            Password: admin123
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminLogin;
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Register() {

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

 
// const onSubmit = async (data) => {
//     try {
//         // Send registration data to the Spring Boot backend
//         const response = await fetch("http://localhost:8080/users", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 fullName: data.fullName.trim(),
//                 email: data.email.trim().toLowerCase(),
//                 password: data.password
//             })
//         });

//         // Handle backend errors
//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(errorText || "Registration failed.");
//         }

//         const registeredUser = await response.json();

//         // Show success message and navigate to login
//         alert(`Registration successful! Welcome ${registeredUser.fullName}`);
//         navigate("/login");

//     } catch (error) {
//         console.error("Registration error:", error);
//         alert(error.message || "Unable to connect to the server.");
//     }
// };



const onSubmit = async (data) => {
    try {
        // Remove confirmPassword before sending data to the backend
        const userData = {
            fullName: data.fullName.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password
        };

        // Send registration data to the Spring Boot backend
        const response = await api.post("/users", userData);

        // Display the registered user's name
        console.log("Registration successful:", response.data);

        alert(`Registration successful! Welcome ${response.data.fullName}`);

        // Navigate to the login page after successful registration
        navigate("/login");

    } catch (error) {
        // Display the error returned by the backend
        console.error(
            "Registration error:",
            error.response?.data || error.message
        );

        if (error.response?.status === 409) {
            alert("This email is already registered.");
        } else {
            alert(
                error.response?.data?.message ||
                "Registration failed! Please try again."
            );
        }
    }
};





    return (

        <div
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #eef2ff, #f8fafc)"
            }}
        >

            <div
                className="container py-5"
                style={{
                    maxWidth: "1100px"
                }}
            >

                <div className="row justify-content-center align-items-center">


                    {/* =========================================
                        LEFT SECTION
                    ========================================= */}

                    <div className="col-lg-6 d-none d-lg-block">

                        <div
                            className="p-5 text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg, #4f46e5, #7c3aed)",
                                borderRadius: "28px",
                                minHeight: "560px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow:
                                    "0 20px 45px rgba(79,70,229,0.25)"
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "55px"
                                }}
                            >
                                🎓
                            </div>

                            <h1
                                className="fw-bold mt-4"
                                style={{
                                    fontSize: "42px"
                                }}
                            >
                                Start Your
                                <br />
                                Placement Journey
                            </h1>

                            <p
                                className="mt-3"
                                style={{
                                    fontSize: "17px",
                                    opacity: 0.9,
                                    lineHeight: "1.7"
                                }}
                            >
                                Prepare for your dream job with
                                aptitude practice, coding questions,
                                interview preparation and performance
                                tracking.
                            </p>


                            <div className="mt-4">

                                <div className="mb-3">
                                    ✓ Practice Aptitude
                                </div>

                                <div className="mb-3">
                                    ✓ Improve Coding Skills
                                </div>

                                <div className="mb-3">
                                    ✓ Prepare for Interviews
                                </div>

                                <div>
                                    ✓ Track Your Progress
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =========================================
                        REGISTER FORM
                    ========================================= */}

                    <div className="col-lg-6 col-md-8">

                        <div
                            className="bg-white p-4 p-md-5"
                            style={{
                                borderRadius: "28px",
                                boxShadow:
                                    "0 15px 40px rgba(0,0,0,0.08)"
                            }}
                        >

                            <div className="text-center mb-4">

                                <div
                                    className="d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "65px",
                                        height: "65px",
                                        borderRadius: "18px",
                                        background: "#eef2ff",
                                        fontSize: "32px"
                                    }}
                                >
                                    👤
                                </div>

                                <h2 className="fw-bold">
                                    Create Account
                                </h2>

                                <p className="text-secondary">
                                    Join JobReady and start preparing
                                    for your dream placement.
                                </p>

                            </div>


                            <form onSubmit={handleSubmit(onSubmit)} noValidate>


                                {/* FULL NAME */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="fullName"
                                        className="form-label fw-semibold"
                                    >
                                        full Name
                                    </label>

                                    <input
                                        id="fullName"
                                        type="text"
                                        {...register("fullName", {
                                            required: "Please enter your full name.",
                                            validate: (value) =>
                                                value.trim().length >= 2 ||
                                                "Name must be at least 2 characters."
                                        })}
                                        className={`form-control form-control-lg${errors.fullName ? " is-invalid" : ""}`}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        aria-invalid={Boolean(errors.fullName)}
                                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                                    />

                                    {errors.fullName && (
                                        <div id="fullName-error" className="invalid-feedback d-block" role="alert">
                                            {errors.fullName.message}
                                        </div>
                                    )}

                                </div>


                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="email"
                                        className="form-label fw-semibold"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email", {
                                            required: "Please enter your email address.",
                                            setValueAs: (value) => value.trim(),
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Please enter a valid email address."
                                            }
                                        })}
                                        className={`form-control form-control-lg${errors.email ? " is-invalid" : ""}`}
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        aria-invalid={Boolean(errors.email)}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />

                                    {errors.email && (
                                        <div id="email-error" className="invalid-feedback d-block" role="alert">
                                            {errors.email.message}
                                        </div>
                                    )}

                                </div>


                                {/* PASSWORD */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="password"
                                        className="form-label fw-semibold"
                                    >
                                        Password
                                    </label>

                                    <div className="input-group">

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            {...register("password", {
                                                required: "Please create a password.",
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters."
                                                },
                                                deps: "confirmPassword"
                                            })}
                                            className={`form-control form-control-lg${errors.password ? " is-invalid" : ""}`}
                                            placeholder="Create password"
                                            autoComplete="new-password"
                                            aria-invalid={Boolean(errors.password)}
                                            aria-describedby={errors.password ? "password-error" : undefined}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            aria-pressed={showPassword}
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >
                                            {showPassword
                                                ? "🙈"
                                                : "👁️"}
                                        </button>

                                    </div>

                                    {errors.password && (
                                        <div id="password-error" className="text-danger small mt-1" role="alert">
                                            {errors.password.message}
                                        </div>
                                    )}

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="mb-4">

                                    <label
                                        htmlFor="confirmPassword"
                                        className="form-label fw-semibold"
                                    >
                                        Confirm Password
                                    </label>

                                    <div className="input-group">

                                        <input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            {...register("confirmPassword", {
                                                required: "Please confirm your password.",
                                                validate: (value) =>
                                                    value === getValues("password") ||
                                                    "Passwords do not match."
                                            })}
                                            className={`form-control form-control-lg${errors.confirmPassword ? " is-invalid" : ""}`}
                                            placeholder="Confirm password"
                                            autoComplete="new-password"
                                            aria-invalid={Boolean(errors.confirmPassword)}
                                            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            aria-pressed={showConfirmPassword}
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword
                                                ? "🙈"
                                                : "👁️"}
                                        </button>

                                    </div>

                                    {errors.confirmPassword && (
                                        <div id="confirmPassword-error" className="text-danger small mt-1" role="alert">
                                            {errors.confirmPassword.message}
                                        </div>
                                    )}

                                </div>


                                {/* REGISTER BUTTON */}

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg w-100 fw-semibold"
                                    disabled={isSubmitting}
                                    style={{
                                        borderRadius: "12px",
                                        padding: "12px"
                                    }}
                                >
                                    {isSubmitting ? "Creating account..." : "Create Account →"}
                                </button>

                            </form>


                            {/* LOGIN */}

                            <div
                                className="text-center mt-4"
                            >

                                <span className="text-secondary">
                                    Already have an account?
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-link fw-semibold text-decoration-none"
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                >
                                    Login
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;
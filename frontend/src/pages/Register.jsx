import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword
    ] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const {
            name,
            email,
            password,
            confirmPassword
        } = formData;

        // Validate fields

        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "Please fill in all fields."
            );

            return;
        }

        // Check password

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );

            return;
        }

        // Password length

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );

            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Registration failed"
                );
            }

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(
                "Registration error:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Header */}

                <div className="auth-header">

                    <h1>
                        Create Account
                    </h1>

                    <p>
                        Register to access the
                        monitoring system
                    </p>

                </div>

                {/* Error */}

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Success */}

                {success && (
                    <div className="auth-success">
                        {success}
                    </div>
                )}

                {/* Form */}

                <form onSubmit={handleSubmit}>

                    {/* Name */}

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                        />

                    </div>

                    {/* Email */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />

                    </div>

                    {/* Password */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a password"
                                value={
                                    formData.password
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Confirm Password */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Submit */}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Login */}

                <div className="auth-footer">

                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Register;
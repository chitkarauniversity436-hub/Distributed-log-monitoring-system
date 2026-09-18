import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3001/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            // Save basic user information if returned
            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }

            // Redirect to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Logo / Heading */}

                <div className="auth-header">
                    <h1>Welcome Back</h1>

                    <p>
                        Sign in to your account
                    </p>
                </div>

                {/* Error */}

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {/* Form */}

                <form onSubmit={handleSubmit}>

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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
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

                    {/* Submit */}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                {/* Register */}

                <div className="auth-footer">

                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css"; // Change to user-login.css

interface FormData {
  email: string;
  password: string;
}

interface LoadingState {
  submission: boolean;
}

interface LoginPageAsUserProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<
    React.SetStateAction<"user" | "admin" | undefined>
  >;
  setUserName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const LoginPageAsUser: React.FC<LoginPageAsUserProps> = ({
  setLoggedIn,
  setUserRole,
  setUserName,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<LoadingState>({ submission: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Removed Bootstrap CDN links from here as they are usually handled globally
  // or by a build tool for a cleaner component

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill all required fields");
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      toast.error("Invalid email format", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending user login request:", { email });
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );
      console.log("User login response:", response.data);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        const name = response.data.name || response.data.email;
        localStorage.setItem("userName", name);
        localStorage.setItem("userRole", response.data.role || "user");
        setSuccess(true);
        setLoggedIn(true);
        setUserRole("user");
        setUserName(name);
        setFormData({ email: "", password: "" });
        toast.success("Login successful! Redirecting to homepage...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("User login error:", err.response?.data);
      const message =
        err.response?.data?.message || "Failed to log in. Please try again.";
      setError(message);
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  return (
    <>
      <div className="user-login-container">
        <div className="user-login-root">
          <div className="user-login-form-wrapper">
            <div className="user-login-form-container">
              {success && (
                <div className="user-login-message user-login-success">
                  Login successful! Redirecting to homepage...
                </div>
              )}
              {error && (
                <div className="user-login-message user-login-error">
                  {error}
                </div>
              )}
              {loading.submission && (
                <div className="user-login-loading" aria-live="polite">
                  Processing...
                </div>
              )}
              <form onSubmit={handleSubmit} className="user-login-form">
                <h2 className="user-login-title">Log In to QLine</h2>
                <div className="user-login-input-group">
                  <label htmlFor="email" className="user-login-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="user-login-input"
                    required
                    disabled={loading.submission}
                  />
                </div>
                <div className="user-login-input-group">
                  <label htmlFor="password" className="user-login-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="user-login-input"
                    required
                    disabled={loading.submission}
                  />
                </div>
                <button
                  type="submit"
                  className="user-login-submit-button"
                  disabled={loading.submission}
                >
                  {loading.submission ? "Logging in..." : "Log In"}
                </button>
                <div className="user-login-links-group">
                  <Link to="/" className="user-login-link">
                    Go back to home page
                  </Link>
                  <Link to="/user/signup" className="user-login-link">
                    Need an account? Sign up.
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPageAsUser;

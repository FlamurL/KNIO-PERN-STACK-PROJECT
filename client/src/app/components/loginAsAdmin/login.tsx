import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";

interface FormData {
  email: string;
  password: string;
  facilityName: string;
}

interface LoadingState {
  submission: boolean;
}

export interface AdminLoginProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<
    React.SetStateAction<"user" | "admin" | undefined>
  >;
}

const AdminLogin: React.FC<AdminLoginProps> = ({
  setLoggedIn,
  setUserRole,
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    facilityName: "",
  });
  const [loading, setLoading] = useState<LoadingState>({ submission: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password, facilityName } = formData;

    if (!email || !password || !facilityName) {
      setError("Please fill all required fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending login request:", { email, facilityName });
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/login`,
        { email, password, facilityName }
      );
      console.log("Login response:", response.data);

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        // Note: The API response for admin login might not include 'name' or 'role' directly.
        // If these are important for your app's state, ensure your backend sends them.
        // For 'userRole', it's explicitly 'admin' here.
        localStorage.setItem("userName", response.data.email); // Using email as username
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("facilityId", response.data.facilityId);
        setLoggedIn(true);
        setUserRole("admin");
        setSuccess(true);
        setFormData({ email: "", password: "", facilityName: "" }); // Clear form on success
        setTimeout(() => {
          navigate(`/admin/home?facilityId=${response.data.facilityId}`);
        }, 1500);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("Login error:", err.response?.data);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message || "Failed to log in. Please try again."
        );
      } else {
        setError("Failed to connect to the server. Please try again.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-root">
        <div className="admin-login-form-wrapper">
          {" "}
          {/* Added wrapper for centering */}
          <div className="admin-login-form-container">
            {success && (
              <div className="admin-login-message admin-login-success">
                Login successful! Redirecting to admin home...
              </div>
            )}

            {error && (
              <div className="admin-login-message admin-login-error">
                {error}
              </div>
            )}

            {loading.submission && (
              <div className="admin-login-loading" aria-live="polite">
                Processing...
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-login-form">
              <h2 className="admin-login-title">Log In to QLine (Admin)</h2>
              <div className="admin-login-input-group">
                <label htmlFor="facilityName" className="admin-login-label">
                  Facility Name
                </label>
                <input
                  type="text"
                  id="facilityName"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleChange}
                  className="admin-login-input"
                  required
                />
              </div>
              <div className="admin-login-input-group">
                <label htmlFor="email" className="admin-login-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="admin-login-input"
                  required
                />
              </div>
              <div className="admin-login-input-group">
                <label htmlFor="password" className="admin-login-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-login-input"
                  required
                />
              </div>
              <button
                type="submit"
                className="admin-login-submit-button"
                disabled={loading.submission}
              >
                {loading.submission ? "Logging in..." : "Log In"}
              </button>
              <div className="admin-login-links-group">
                <Link to="/" className="admin-login-link">
                  Go back to home page
                </Link>
                <Link to="/admin/signup" className="admin-login-link">
                  Need an account? Sign up.
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

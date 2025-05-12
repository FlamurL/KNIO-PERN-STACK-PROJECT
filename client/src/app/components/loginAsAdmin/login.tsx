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
        localStorage.setItem("userName", response.data.name || "Admin");
        localStorage.setItem("userRole", response.data.role || "admin");
        localStorage.setItem("facilityId", response.data.facilityId);
        setLoggedIn(true);
        setUserRole("admin");
        setSuccess(true);
        setFormData({ email: "", password: "", facilityName: "" });
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
    <div className="login-container">
      <div className="login-root">
        <div className="form-container">
          {success && (
            <div className="message success">
              Login successful! Redirecting to admin home...
            </div>
          )}

          {error && <div className="message error">{error}</div>}

          {loading.submission && (
            <div className="loading" aria-live="polite">
              Processing...
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <h2>Log In to QLine (Admin)</h2>
            <div className="input-group">
              <label htmlFor="facilityName">Facility Name</label>
              <input
                type="text"
                id="facilityName"
                name="facilityName"
                value={formData.facilityName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={loading.submission}
            >
              {loading.submission ? "Logging in..." : "Log In"}
            </button>
            <div className="linkss">
              <Link to="/">Go back to home page</Link>
            </div>
            <div className="linkss">
              <Link to="/admin/signup">Need an account? Sign up.</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

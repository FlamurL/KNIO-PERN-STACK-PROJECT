import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

interface FormData {
  email: string;
  password: string;
}

interface LoadingState {
  submission: boolean;
}

const LoginAsUser: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<LoadingState>({ submission: false });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Dynamically load Bootstrap for minimal styling
  useEffect(() => {
    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    bootstrapCSS.rel = "stylesheet";
    document.head.appendChild(bootstrapCSS);

    const bootstrapJS = document.createElement("script");
    bootstrapJS.src =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
    bootstrapJS.async = true;
    document.body.appendChild(bootstrapJS);

    return () => {
      document.head.removeChild(bootstrapCSS);
      document.body.removeChild(bootstrapJS);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;

    // Client-side validation
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

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long", {
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem(
          "userName",
          response.data.name || response.data.email
        );
        setSuccess(true);
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
      <div className="login-container">
        <div className="login-root">
          <div className="form-container">
            {success && (
              <div className="message success">
                Login successful! Redirecting to homepage...
              </div>
            )}
            {error && <div className="message error">{error}</div>}
            {loading.submission && (
              <div className="loading" aria-live="polite">
                Processing...
              </div>
            )}
            <form onSubmit={handleSubmit} className="login-form">
              <h2>Log In to QLine</h2>
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
                  disabled={loading.submission}
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
                  disabled={loading.submission}
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
                <Link to="/user/signup">Need an account? Sign up.</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default LoginAsUser;

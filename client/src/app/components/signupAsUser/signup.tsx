import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css"; // Changed to user-signup.css

interface FormData {
  name: string;
  email: string;
  password: string;
}

const SignUpAsUser: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("Please fill all required fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        { name, email, password }
      );

      if (response.status === 201 && response.data.status === "ok") {
        setSuccess(true);
        setFormData({ name: "", email: "", password: "" });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Failed to register user. Please try again."
        );
      } else {
        setError("Failed to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-signup-container">
      <div className="user-signup-root">
        <div className="user-signup-form-wrapper">
          <div className="user-signup-form-container">
            {success && (
              <div className="user-signup-message user-signup-success">
                Registration successful! Redirecting to homepage...
              </div>
            )}

            {error && (
              <div className="user-signup-message user-signup-error">
                {error}
              </div>
            )}

            {loading && (
              <div className="user-signup-loading" aria-live="polite">
                Processing...
              </div>
            )}

            <form onSubmit={handleSubmit} className="user-signup-form">
              <h2 className="user-signup-title">Sign Up to QLine</h2>
              <div className="user-signup-input-group">
                <label htmlFor="name" className="user-signup-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="user-signup-input"
                  required
                />
              </div>
              <div className="user-signup-input-group">
                <label htmlFor="email" className="user-signup-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="user-signup-input"
                  required
                />
              </div>
              <div className="user-signup-input-group">
                <label htmlFor="password" className="user-signup-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="user-signup-input"
                  required
                />
              </div>
              <button
                type="submit"
                className="user-signup-submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
              <div className="user-signup-links-group">
                <Link to="/" className="user-signup-link">
                  Go back to home page
                </Link>
                <Link to="/user/login" className="user-signup-link">
                  Already have an account? Sign in.
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpAsUser;

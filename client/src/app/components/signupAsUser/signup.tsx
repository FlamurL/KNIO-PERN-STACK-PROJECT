import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

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
    <div className="signup-container">
      <div className="signup-root">
        <div className="form-container">
          {success && (
            <div className="message success">
              Registration successful! Redirecting to homepage...
            </div>
          )}

          {error && <div className="message error">{error}</div>}

          {loading && (
            <div className="loading" aria-live="polite">
              Processing...
            </div>
          )}

          <form onSubmit={handleSubmit} className="sign-up-form">
            <h2>Sign Up to QLine</h2>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
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
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <div className="linkss">
              <Link to="/">Go back to home page</Link>
            </div>
            <div className="linkss">
              <Link to="/user/login">Already have an account? Sign in.</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpAsUser;

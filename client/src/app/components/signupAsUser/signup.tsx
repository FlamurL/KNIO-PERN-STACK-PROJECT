import { useState, ChangeEvent, FormEvent } from "react";
import "./signup.css"; // Keep using your existing CSS file if styles are shared
import { Link } from "react-router-dom";

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignUpAsUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // HERE YOU CAN SEND THE DATA TO THE BACKEND
      console.log("Submitting form data:", formData);
      // SIMULATE BACKEND CALL
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);

      setFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError("Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {success && (
        <div className="message success">
          Registration successful! Thank you.
        </div>
      )}

      {error && <div className="message error">{error}</div>}

      {loading && <div className="loading">Processing...</div>}

      <form onSubmit={handleSubmit} className="sign-up-form">
        <h2>Sign Up</h2>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input"
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          Submit
        </button>
        <div className="linkss">
          <Link to="/">Go back to home page</Link>
        </div>
        <div className="linkss">
          <Link to="/user/login">Already have an account? Sign in.</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpAsUser;

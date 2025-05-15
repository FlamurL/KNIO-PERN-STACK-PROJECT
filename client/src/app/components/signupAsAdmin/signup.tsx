import { useState, useEffect } from "react";
import "./signup.css"; // Changed to admin-signup.css
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Define interfaces for type safety
interface FormData {
  facilityName: string;
  facilityAddress: string;
  zipCode: string;
  country: string;
  city: string;
  email: string;
  password: string;
  waitingTime: number;
}

interface Country {
  iso2: string;
  name: string;
  capital: string;
}

interface LoadingState {
  countries: boolean;
  submission: boolean;
}

// Static JSON array for Macedonian cities
const macedonianCities = [
  "Skopje",
  "Bitola",
  "Kumanovo",
  "Prilep",
  "Tetovo",
  "Veles",
  "Štip",
  "Ohrid",
  "Gostivar",
  "Strumica",
  "Kavadarci",
  "Kočani",
  "Kičevo",
  "Struga",
  "Radoviš",
  "Gevgelija",
  "Debar",
  "Kratovo",
  "Pehčevo",
  "Delčevo",
  "Vinica",
  "Berovo",
  "Negotino",
  "Kriva Palanka",
];

const SignUpAsAdmin: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    countries: false,
    submission: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    facilityName: "",
    facilityAddress: "",
    zipCode: "",
    country: "",
    city: "",
    email: "",
    password: "",
    waitingTime: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading((prev) => ({ ...prev, countries: true }));
      setError(null);

      try {
        const response = await fetch(
          "https://api.countrystatecity.in/v1/countries",
          {
            headers: {
              "X-CSCAPI-KEY":
                "cDVES3VtRHFFVlZ3NzJybUZVRjQ2OWdla0lhMGRFbUlTTG1HTU5Zcg==", // Move to .env in production
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch countries");
        const data: Country[] = await response.json();
        setCountries(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading((prev) => ({ ...prev, countries: false }));
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "waitingTime" ? Number(value) : value,
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      country: selectedCountry,
      city: "", // Reset city when country changes
    }));

    // If "Macedonia" (MK) is selected, use the static list of Macedonian cities
    if (selectedCountry === "MK") {
      setCities(macedonianCities);
    } else {
      // For other countries, try to get the capital city from the fetched data
      const selectedCountryData = countries.find(
        (c) => c.iso2 === selectedCountry
      );
      if (selectedCountryData && selectedCountryData.capital) {
        setCities([selectedCountryData.capital]); // Only include the capital
      } else {
        setCities([]); // No cities if capital not found or country not recognized
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      facilityName,
      facilityAddress,
      zipCode,
      country,
      city,
      email,
      password,
      waitingTime,
    } = formData;

    // Basic client-side validation
    if (
      !facilityName ||
      !facilityAddress ||
      !zipCode ||
      !country ||
      !city ||
      !email ||
      !password ||
      waitingTime <= 0
    ) {
      setError("Please fill all required fields with valid values.");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format.");
      return;
    }

    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending form data:", formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admin/register`,
        {
          facilityName,
          facilityAddress,
          zipCode,
          country,
          city,
          email,
          password,
          waitingTime,
        }
      );

      if (response.status === 201 && response.data.status === "ok") {
        setSuccess(true);
        // Clear form data after successful submission
        setFormData({
          facilityName: "",
          facilityAddress: "",
          zipCode: "",
          country: "",
          city: "",
          email: "",
          password: "",
          waitingTime: 0,
        });
        setCities([]); // Clear cities as well
        setTimeout(() => {
          navigate("/"); // Redirect to home or login page after a delay
        }, 1500);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
            "Failed to register admin. Please try again."
        );
      } else {
        setError("Failed to connect to the server. Please try again.");
      }
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-root">
        <div className="admin-signup-form-wrapper">
          <div className="admin-signup-form-container">
            {success && (
              <div className="admin-signup-message admin-signup-success">
                Registration successful! Redirecting to homepage...
              </div>
            )}

            {error && (
              <div className="admin-signup-message admin-signup-error">
                {error}
              </div>
            )}

            {(loading.countries || loading.submission) && (
              <div className="admin-signup-loading" aria-live="polite">
                {loading.countries ? "Loading countries..." : "Processing..."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-signup-form">
              <h2 className="admin-signup-title">Sign Up As Admin</h2>
              <div className="admin-signup-input-group">
                <label htmlFor="facilityName" className="admin-signup-label">
                  Facility Name
                </label>
                <input
                  type="text"
                  id="facilityName"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleChange}
                  className="admin-signup-input"
                  required
                />
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="facilityAddress" className="admin-signup-label">
                  Facility Address
                </label>
                <input
                  type="text"
                  id="facilityAddress"
                  name="facilityAddress"
                  value={formData.facilityAddress}
                  onChange={handleChange}
                  className="admin-signup-input"
                  required
                />
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="zipCode" className="admin-signup-label">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="admin-signup-input"
                  required
                />
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="country" className="admin-signup-label">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="admin-signup-input admin-signup-select"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="city" className="admin-signup-label">
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="admin-signup-input admin-signup-select"
                  required
                  disabled={!formData.country || cities.length === 0}
                >
                  <option value="">Select a city</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="email" className="admin-signup-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="admin-signup-input"
                  required
                />
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="password" className="admin-signup-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-signup-input"
                  required
                />
              </div>
              <div className="admin-signup-input-group">
                <label htmlFor="waitingTime" className="admin-signup-label">
                  Time needed for person (minutes)
                </label>
                <input
                  type="number"
                  id="waitingTime"
                  name="waitingTime"
                  value={formData.waitingTime}
                  onChange={handleChange}
                  className="admin-signup-input"
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                className="admin-signup-submit-button"
                disabled={loading.submission || loading.countries}
              >
                {loading.submission ? "Submitting..." : "Submit"}
              </button>
              <div className="admin-signup-links-group">
                <Link to="/" className="admin-signup-link">
                  Go back to home page
                </Link>
                <Link to="/admin/login" className="admin-signup-link">
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

export default SignUpAsAdmin;

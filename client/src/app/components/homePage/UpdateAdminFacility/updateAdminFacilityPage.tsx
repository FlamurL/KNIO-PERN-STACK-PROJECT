import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface FacilityResponse {
  status: string;
  data: {
    id: string;
    facilityName: string;
    facilityAddress: string;
    zipCode: string;
    country: string;
    city: string;
    email: string;
    waitingTime: number;
  };
}

interface Country {
  iso2: string;
  name: string;
  capital: string;
}

const macedonianCities = [
  "Skopje",
  "Bitola",
  "Kumanovo",
  "Prilep",
  "Tetovo",
  "Veles",
  "Ohrid",
  "Gostivar",
  "Strumica",
  "Kavadarci",
  "Kochani",
  "Kicevo",
  "Struga",
  "Radovish",
  "Gevgelija",
  "Debar",
  "Kriva Palanka",
  "Negotino",
  "Sveti Nikole",
  "Delchevo",
  "Vinica",
  "Resen",
  "Probistip",
  "Berovo",
  "Bogdanci",
  "Demir Kapija",
  "Krusevo",
  "Makedonski Brod",
  "Pehchevo",
  "Valandovo",
  "Demir Hisar",
  "Makedonska Kamenica",
  "Krivogashtani",
  "Plasnica",
  "Zelenikovo",
  "Vevchani",
  "Novaci",
  "Rosoman",
  "Drugovo",
  "Dojran",
  "Centar Zhupa",
  "Rankovce",
  "Konche",
  "Karbinci",
  "Gradsko",
  "Staro Nagorichane",
  "Vrapchishte",
  "Lipkovo",
  "Bogovinje",
  "Brvenica",
  "Jegunovce",
  "Tearce",
  "Chucher Sandevo",
  "Studenichani",
  "Saraj",
  "Sopishte",
  "Shuto Orizari",
  "Petrovec",
  "Ilinden",
  "Zelenikovo",
  "Arachinovo",
];

const UpdateFacilityPage = () => {
  const [formData, setFormData] = useState({
    facilityName: "",
    facilityAddress: "",
    zipCode: "",
    country: "",
    city: "",
    email: "",
    password: "",
    waitingTime: 5,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const facilityId = queryParams.get("facilityId");
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken || !facilityId) {
      navigate("/admin/login");
      return;
    }

    const fetchFacility = async () => {
      try {
        const response = await axios.get<FacilityResponse>(
          `${process.env.REACT_APP_API_URL}/api/admin/${facilityId}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        const data = response.data.data;
        setFormData({
          facilityName: data.facilityName || "",
          facilityAddress: data.facilityAddress || "",
          zipCode: data.zipCode || "",
          country: data.country || "",
          city: data.city || "",
          email: data.email || "",
          password: "",
          waitingTime: data.waitingTime || 5,
        });
      } catch (err: any) {
        console.error("Error fetching facility:", err);
        setError(err.response?.data?.message || "Failed to load facility data");
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://api.countrystatecity.in/v1/countries",
          {
            headers: {
              "X-CSCAPI-KEY":
                "cDVES3VtRHFFVlZ3NzJybUZVRjQ2OWdla0lhMGRFbUlTTG1HTU5Zcg==",
            },
          }
        );
        const countriesData = await response.json();
        setCountries(countriesData);
      } catch (err) {
        console.error("Failed to fetch countries", err);
      }
    };

    fetchFacility();
    fetchCountries();
  }, [facilityId, adminToken, navigate]);

  useEffect(() => {
    if (formData.country === "MK") {
      setCities(macedonianCities);
    } else {
      const selected = countries.find((c) => c.iso2 === formData.country);
      if (selected?.capital) {
        setCities([selected.capital]);
      } else {
        setCities([]);
      }
    }
  }, [formData.country, countries]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      city: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/${facilityId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setSuccess("Facility updated successfully");
      setError(null);
      setTimeout(() => navigate(`/admin/home?facilityId=${facilityId}`), 2000);
    } catch (err: any) {
      console.error("Error updating facility:", err);
      setError(err.response?.data?.message || "Failed to update facility");
      setSuccess(null);
    }
  };

  const handleGoBack = () => {
    navigate(`/admin/home?facilityId=${facilityId}`);
  };

  return (
    <div className="admin-facility-body-queue">
      <nav className="navbar-queue">
        <button className="nav-button-queue" onClick={handleGoBack}>
          Go Back
        </button>
      </nav>

      <h1 className="h1-queue">Update Facility Information</h1>

      {error && <div className="alert-queue">{error}</div>}
      {success && <div className="alert-success-queue">{success}</div>}

      <form
        className="form-queue"
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", marginLeft: "40%" }}
      >
        <div className="form-group-queue">
          <label className="label-queue">Facility Name</label>
          <input
            type="text"
            name="facilityName"
            value={formData.facilityName}
            onChange={handleChange}
            style={{ width: "250px" }}
            required
          />
        </div>

        <div className="form-group-queue">
          <label className="label-queue">Address</label>
          <input
            type="text"
            name="facilityAddress"
            value={formData.facilityAddress}
            onChange={handleChange}
            className="input-queue"
            style={{ width: "250px" }}
            required
          />
        </div>

        <div className="form-group-queue">
          <label className="label-queue">Zip Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="input-queue"
            style={{ width: "250px" }}
            required
          />
        </div>

        <div className="form-group-queue">
          <label className="label-queue">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            className="input-queue"
            required
            style={{ width: "250px" }}
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c.iso2} value={c.iso2}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-queue">
          <label className="label-queue">City</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="input-queue"
            required
            style={{ width: "250px" }}
          >
            <option value="">Select a city</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-queue">
          <label className="label-queue">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-queue"
            style={{ width: "250px" }}
            required
          />
        </div>

        <div className="form-group-queue">
          <label className="label-queue">
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-queue"
            style={{ width: "250px" }}
          />
        </div>

        <div className="form-group-queue">
          <label className="label-queue">Waiting Time (minutes)</label>
          <input
            type="number"
            name="waitingTime"
            value={formData.waitingTime}
            onChange={handleChange}
            className="input-queue"
            style={{ width: "50px" }}
            min="1"
            required
          />
        </div>

        <button type="submit" className="btn-queue" style={{ width: "20%" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateFacilityPage;

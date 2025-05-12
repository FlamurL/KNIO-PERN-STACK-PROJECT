import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface FacilityResponse {
  status: string;
  data: {
    id: string;
    facilityName: string;
    facilityAddress: string;
    zipcode: string;
    country: string;
    city: string;
    email: string;
    waitingTime: number;
  };
}

const UpdateFacilityPage = () => {
  const [formData, setFormData] = useState({
    facilityName: "",
    facilityAddress: "",
    zipcode: "",
    country: "",
    city: "",
    email: "",
    password: "",
    waitingTime: 5,
  });
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
          zipcode: data.zipcode || "",
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

    fetchFacility();
  }, [facilityId, adminToken, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("facilityId");
    navigate("/");
  };

  return (
    <div className="admin-facility-body-queue">
      <nav className="navbar-queue">
        <button className="nav-button-queue" onClick={handleLogout}>
          Log Out
        </button>
      </nav>

      <h1 className="h1-queue">Update Facility Information</h1>

      {error && (
        <div className="alert-queue" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="alert-success-queue" role="alert">
          {success}
        </div>
      )}

      <form className="form-queue" onSubmit={handleSubmit}>
        <div className="form-group-queue">
          <label className="label-queue">Facility Name</label>
          <input
            type="text"
            name="facilityName"
            value={formData.facilityName}
            onChange={handleChange}
            className="input-queue"
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
          />
        </div>
        <div className="form-group-queue">
          <label className="label-queue">Zipcode</label>
          <input
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="input-queue"
          />
        </div>
        <div className="form-group-queue">
          <label className="label-queue">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="input-queue"
            required
          />
        </div>
        <div className="form-group-queue">
          <label className="label-queue">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="input-queue"
            required
          />
        </div>
        <div className="form-group-queue">
          <label className="label-queue">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-queue"
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
            min="1"
            required
          />
        </div>
        <button type="submit" className="btn-queue">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateFacilityPage;

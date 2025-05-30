import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../navbar";

interface QueuePerson {
  id: string;
  name: string;
  status: "waiting";
}

interface FacilityResponse {
  status: string;
  data: {
    id: string;
    facilityName: string;
    waitingTime: number;
  };
}

interface QueueResponse {
  status: string;
  data: {
    queue: QueuePerson[];
    peopleInQueue: number;
  };
}

interface AdminFacilityPageProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin";
  userName?: string;
  onLogout?: () => void;
}

const AdminFacilityPage: React.FC<AdminFacilityPageProps> = ({
  isLoggedIn,
  userRole,
  userName,
  onLogout,
}) => {
  const [facilityName, setFacilityName] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState<number>(5);
  const [queue, setQueue] = useState<QueuePerson[]>([]);
  const [peopleInQueue, setPeopleInQueue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const facilityId = queryParams.get("facilityId");
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken || !facilityId || !isLoggedIn || userRole !== "admin") {
      console.log("Redirecting to login: Invalid state", {
        adminToken: !!adminToken,
        facilityId,
        isLoggedIn,
        userRole,
      });
      navigate("/admin/login");
      return;
    }

    const fetchFacilityAndQueue = async () => {
      try {
        console.log("Fetching facility and queue for facilityId:", facilityId);
        const facilityResponse = await axios.get<FacilityResponse>(
          `${process.env.REACT_APP_API_URL}/api/admin/${facilityId}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        const facilityData = facilityResponse.data.data;
        setFacilityName(facilityData.facilityName || "Unknown Facility");
        setWaitingTime(facilityData.waitingTime || 5);

        const queueResponse = await axios.get<QueueResponse>(
          `${process.env.REACT_APP_API_URL}/api/queue/${facilityId}`,
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        const queueData = queueResponse.data.data;
        setQueue(queueData.queue);
        setPeopleInQueue(queueData.peopleInQueue);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        const message =
          err.response?.data?.message ||
          "Failed to load facility or queue data";
        setError(message);
        if (err.response?.status === 401) {
          console.log("Unauthorized: Redirecting to login");
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      }
    };

    fetchFacilityAndQueue();
  }, [facilityId, adminToken, isLoggedIn, userRole, navigate]);

  const handleUpdateFacility = () => {
    console.log("Navigating to update facility:", facilityId);
    navigate(`/admin/update?facilityId=${facilityId}`);
  };

  const handleDeleteFacility = async () => {
    if (!window.confirm("Are you sure you want to delete this facility?"))
      return;

    try {
      console.log("Deleting facility:", facilityId);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/admin/${facilityId}`,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      localStorage.removeItem("facilityId");
      navigate("/");
    } catch (err: any) {
      console.error("Error deleting facility:", err);
      const message =
        err.response?.data?.message || "Failed to delete facility";
      setError(message);
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (err.response?.status === 401) {
        console.log("Unauthorized: Redirecting to login");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  };

  const handleRemoveAllUsers = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove all users from this queue?"
      )
    )
      return;

    try {
      console.log("Removing all users from queue:", { facilityId, adminToken });
      const response = await axios.post<QueueResponse>(
        `${process.env.REACT_APP_API_URL}/api/queue/${facilityId}/remove-all-users`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      console.log("Remove all users response:", response.data);
      const queueData = response.data.data;
      setQueue(queueData.queue);
      setPeopleInQueue(queueData.peopleInQueue);
      setError(null);
      toast.success("All users removed from queue", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err: any) {
      console.error("Error removing all users:", err);
      console.log("Error response:", err.response?.data);
      const message =
        err.response?.data?.message || "Failed to remove all users";
      setError(message);
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (err.response?.status === 401) {
        console.log("Unauthorized: Redirecting to login");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  };

  const handleLeaveQueue = async (userId: string) => {
    try {
      console.log("Removing user from queue:", {
        facilityId,
        userId,
        adminToken,
      });
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/queue/leave/${facilityId}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      console.log("Leave queue response:", response.data);
      const queueData = response.data.data;
      setQueue(queueData.queue);
      setPeopleInQueue(queueData.peopleInQueue);
      setError(null);
      toast.success("User removed from queue", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err: any) {
      console.error("Error removing user from queue:", err);
      const message =
        err.response?.data?.message || "Failed to remove user from queue";
      setError(message);
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      if (err.response?.status === 401) {
        console.log("Unauthorized: Redirecting to login");
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    }
  };

  const estimatedWaitTime = peopleInQueue * waitingTime;

  return (
    <div className="admin-facility-body-queue">
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
      />

      <h1 className="h1-queue">
        Welcome Owner of the{" "}
        <span className="facility-name-queue">
          {facilityName || "Loading..."}
        </span>{" "}
        queue
      </h1>

      {error && (
        <div className="alert-queue" role="alert">
          {error}
        </div>
      )}

      <div
        className="container-queue"
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
        }}
      >
        <button
          className="btn-queue adminfacqueue"
          onClick={handleUpdateFacility}
          style={{ width: "250px", marginBottom: "20px" }}
        >
          Update Information
        </button>
        <button
          className="btn-queue btn-danger-queue adminfacqueue"
          onClick={handleDeleteFacility}
          style={{ width: "250px", marginBottom: "20px" }}
        >
          Delete Facility
        </button>
      </div>
      <div className="container-queue">
        <button
          className="btn-queue btn-danger-queue adminfacqueue"
          onClick={handleRemoveAllUsers}
          style={{ width: "250px", marginBottom: "20px" }}
        >
          Remove All Users
        </button>
      </div>

      <div className="stats-queue">
        <div className="stat-card-queue">
          <div className="stat-label-queue">People in queue</div>
          <div className="stat-value-queue">{peopleInQueue}</div>
        </div>
        <div className="stat-card-queue">
          <div className="stat-label-queue">Estimated wait time</div>
          <div className="stat-value-queue">
            <span className="time-to-wait-queue">{estimatedWaitTime}</span> min
          </div>
        </div>
      </div>

      <table id="queueTable" className="table-queue">
        <thead>
          <tr className="table-header-queue">
            <th className="th-queue">Name</th>
            <th className="th-queue">Actions</th>
          </tr>
        </thead>
        <tbody className="table-body-queue">
          {queue.length === 0 ? (
            <tr>
              <td colSpan={2} className="td-queue">
                No users in queue
              </td>
            </tr>
          ) : (
            queue.map((person) => (
              <tr
                key={person.id}
                className="person-row-queue person-waiting-queue"
              >
                <td className="td-queue">{person.name}</td>
                <td className="td-queue">
                  <button
                    className="queue-btn-queue"
                    onClick={() => handleLeaveQueue(person.id)}
                  >
                    Leave
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default AdminFacilityPage;

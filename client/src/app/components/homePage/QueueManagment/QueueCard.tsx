import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./joinQueue.css";

interface QueuePerson {
  id: string;
  name: string;
  status: "waiting";
}

interface QueueResponse {
  status: string;
  data: {
    facilityId: string;
    queue: QueuePerson[];
    peopleInQueue: number;
  };
}

interface FacilityResponse {
  status: string;
  data: {
    id: string;
    facilityName: string;
    waitingTime: number;
  };
}

const JoinQueuePage = () => {
  const [loggedInName, setLoggedInName] = useState<string | null>(null);
  const [facilityName, setFacilityName] = useState<string | null>(null);
  const [waitingTime, setWaitingTime] = useState<number>(5);
  const [queue, setQueue] = useState<QueuePerson[]>([]);
  const [peopleInQueue, setPeopleInQueue] = useState<number>(0);
  const [isUserInQueue, setIsUserInQueue] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const facilityId = queryParams.get("facilityId");

  const userToken = localStorage.getItem("userToken");
  const isLoggedIn = !!userToken;

  useEffect(() => {
    if (!facilityId) {
      setError("No facility ID provided");
      setFacilityName("Unknown Facility");
      return;
    }

    const fetchFacilityAndQueue = async () => {
      try {
        const facilityResponse = await axios.get<FacilityResponse>(
          `${process.env.REACT_APP_API_URL}/api/admin/${facilityId}`
        );
        const facilityData = facilityResponse.data.data;
        setFacilityName(facilityData.facilityName || "Unknown Facility");
        setWaitingTime(facilityData.waitingTime || 5);

        const queueResponse = await axios.get<QueueResponse>(
          `${process.env.REACT_APP_API_URL}/api/queue/${facilityId}`,
          {
            headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
          }
        );
        const queueData = queueResponse.data.data;
        setQueue(queueData.queue);
        setPeopleInQueue(queueData.peopleInQueue);
        setIsUserInQueue(
          queueData.queue.some(
            (person) => person.name === localStorage.getItem("userName")
          )
        );
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(
          err.response?.data?.message || "Failed to load facility or queue data"
        );
      }
    };

    fetchFacilityAndQueue();
  }, [facilityId, userToken]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setLoggedInName(storedName);
    } else if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleJoinQueue = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (isUserInQueue) {
      alert("You are already in this queue.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/queue/${facilityId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const queueData = response.data.data;
      setQueue(queueData.queue);
      setPeopleInQueue(queueData.peopleInQueue);
      setIsUserInQueue(true);
      setError(null);
    } catch (err: any) {
      console.error("Error joining queue:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to join queue";
      setError(errorMessage);
      // Displays e.g., "User is already in another queue: <facilityName>"
    }
  };

  const handleRemoveFromQueue = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/queue/${facilityId}/leave`,
        {},
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      const queueData = response.data.data;
      setQueue(queueData.queue);
      setPeopleInQueue(queueData.peopleInQueue);
      setIsUserInQueue(false);
      setError(null);
    } catch (err: any) {
      console.error("Error leaving queue:", err);
      setError(err.response?.data?.message || "Failed to leave queue");
    }
  };

  const handleGoBack = () => {
    navigate("/"); // Redirect to homepage (FacilitiesSection)
  };

  const estimatedWaitTime = peopleInQueue * waitingTime;

  return (
    <div className="join-queue-body-queue">
      <nav className="navbar-queue">
        <button className="nav-button-queue" onClick={handleGoBack}>
          Go Back
        </button>
      </nav>

      <h1 className="h1-queue">
        Join the Queue{" "}
        <span className="facility-name-queue">
          {facilityName || "Loading..."}
        </span>
      </h1>

      {error && (
        <div className="alert-queue" role="alert">
          {error}
        </div>
      )}

      <div className="container-queue">
        <div className="form-group-queue">
          <div className="form-header-queue">
            <label htmlFor="username" className="label-queue">
              Your Name
            </label>
            <span className="user-name-queue">{loggedInName || "Guest"}</span>
            <a href="/queue-dashboard" className="dashboard-link-queue">
              See the dashboard
            </a>
          </div>
        </div>

        {isLoggedIn && !isUserInQueue && (
          <button className="btn-queue" onClick={handleJoinQueue}>
            Join the Queue
          </button>
        )}

        {isLoggedIn && isUserInQueue && (
          <button className="btn-queue" onClick={handleRemoveFromQueue}>
            Leave Queue
          </button>
        )}

        {!isLoggedIn && (
          <p className="label-queue">
            <a href="/login" className="login-link-queue">
              Log in
            </a>{" "}
            to join the queue.
          </p>
        )}
      </div>

      <div className="stats-queue">
        <div className="stat-card-queue">
          <div className="stat-label-queue">People in queue</div>
          <div className="stat-value-queue" id="people_in_queue">
            {peopleInQueue}
          </div>
        </div>
        <div className="stat-card-queue">
          <div className="stat-label-queue">Estimated wait time</div>
          <div className="stat-value-queue">
            <span className="time-to-wait-queue" id="time_to_wait">
              {estimatedWaitTime}
            </span>{" "}
            min
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
          {queue.map((person) => (
            <tr
              key={person.id}
              className="person-row-queue person-waiting-queue"
            >
              <td className="td-queue">{person.name}</td>
              <td className="td-queue">
                {loggedInName === person.name && isLoggedIn && (
                  <button
                    className="queue-btn-queue"
                    onClick={handleRemoveFromQueue}
                  >
                    Leave
                  </button>
                )}
                {loggedInName !== person.name && (
                  <span className="label-queue">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JoinQueuePage;

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface FacilityCardProps {
  facilityName: string | null;
  country: string;
  city: string;
  address: string | null;
  facilityId: string;
}

const FacilityCard: React.FC<FacilityCardProps> = ({
  facilityName,
  country,
  city,
  address,
  facilityId,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("userToken");

  const handleViewDetails = () => {
    if (isLoggedIn) {
      navigate(`/user/queue?facilityId=${facilityId}`);
    } else {
      alert("Please sign in as user to view queue details.");
      navigate("/user/login");
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          card.classList.add("in-view");
          observer.unobserve(card);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(card);
    return () => {
      if (card) observer.unobserve(card);
    };
  }, []);

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 facility-card" ref={cardRef}>
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0 text-center">
            {facilityName || "Unnamed Facility"}
          </h5>
        </div>
        <div className="card-body">
          <div className="facility-icon mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="bi bi-building"
              viewBox="0 0 16 16"
            >
              <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm.5.5h7v10h-7z" />
              <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm13 10V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1" />
            </svg>
          </div>
          <ul className="list-unstyled">
            <li>
              <strong>Country:</strong> {country}
            </li>
            <li>
              <strong>City:</strong> {city}
            </li>
            <li>
              <strong>Address:</strong> {address || "No address provided"}
            </li>
          </ul>
        </div>
        <div className="card-footer">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleViewDetails}
          >
            View Queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

import React, { useEffect, useRef } from "react";

interface FacilityCardProps {
  title: string;
  headerClass: string;
  icon: React.ReactNode;
  country: string;
  city: string;
  address: string;
  services: string;
  description: string;
  buttonClass: string;
}

const FacilityCard: React.FC<FacilityCardProps> = ({
  title,
  headerClass,
  icon,
  country,
  city,
  address,
  services,
  description,
  buttonClass,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

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
        <div className={`card-header ${headerClass}`}>
          <h5 className="card-title mb-0 text-center">{title}</h5>
        </div>
        <div className="card-body">
          <div className="facility-icon mb-3">{icon}</div>
          <ul className="list-unstyled">
            <li>
              <strong>Country:</strong> {country}
            </li>
            <li>
              <strong>City:</strong> {city}
            </li>
            <li>
              <strong>Address:</strong> {address}
            </li>
            <li>
              <strong>Services:</strong> {services}
            </li>
          </ul>
          <p className="card-text">{description}</p>
        </div>
        <div className="card-footer">
          <a href="#" className={`btn ${buttonClass} btn-sm`}>
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

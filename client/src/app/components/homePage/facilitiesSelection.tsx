import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import FacilityCard from "./facilityCard";

interface Facility {
  facilityName: string | null;
  country: string;
  city: string;
  address: string | null;
  id: string;
}

interface FacilitiesResponse {
  status: string;
  data: {
    id: string;
    facilityName: string | null;
    country: string;
    city: string;
    facilityAddress: string | null;
  }[];
}

const FacilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<FacilitiesResponse>(
          `${process.env.REACT_APP_API_URL}/api/admin`
        );

        if (response.status === 200) {
          const data = response.data.data.map((item) => ({
            facilityName: item.facilityName || null,
            country: item.country,
            city: item.city,
            address: item.facilityAddress || null,
            id: item.id,
          }));
          setFacilities(data);
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch facilities. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");
          observer.unobserve(section);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <section className="facility-cards py-5" ref={sectionRef}>
      <div className="container">
        <h2 className="text-center mb-4">Our Partner Facilities</h2>
        <p className="text-center mb-5">
          Our queue management system is trusted by various institutions across
          different sectors
        </p>
        {loading && (
          <div className="text-center" aria-live="polite">
            Loading facilities...
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && facilities.length === 0 && (
          <div className="text-center">
            No facilities available at this time.
          </div>
        )}
        <div className="row g-4">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facilityName={facility.facilityName}
              country={facility.country}
              city={facility.city}
              address={facility.address}
              facilityId={facility.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;

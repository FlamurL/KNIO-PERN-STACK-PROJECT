import React, { useEffect, useRef } from "react";
import FacilityCard from "./facilityCard";

// Define the Facility interface for type safety
interface Facility {
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

const FacilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  const facilities: Facility[] = [
    {
      title: "University of Technology",
      headerClass: "bg-primary text-white",
      icon: (
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
      ),
      country: "United States",
      city: "Boston",
      address: "123 Education Drive",
      services: "Enrollment, Academic Advising, Financial Aid",
      description:
        "Streamlining student services with digital queue management across multiple departments.",
      buttonClass: "btn-outline-primary",
    },
    {
      title: "Central City Hospital",
      headerClass: "bg-success text-white",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-hospital"
          viewBox="0 0 16 16"
        >
          <path d="M8.5 5.034v1.1l.953-.55.5.867L9 7l.953.55-.5.866-.953-.55v1.1h-1v-1.1l-.953.55-.5-.866L7 7l-.953-.55.5-.866.953.55v-1.1zM2 2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm2 .5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zm0 9V7h10v4.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5" />
        </svg>
      ),
      country: "Canada",
      city: "Toronto",
      address: "456 Healthcare Avenue",
      services: "Outpatient Care, Lab Tests, Pharmacy",
      description:
        "Reducing wait times and improving patient experience with real-time queue updates.",
      buttonClass: "btn-outline-success",
    },
    {
      title: "Municipal Services Office",
      headerClass: "bg-info text-white",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-buildings"
          viewBox="0 0 16 16"
        >
          <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
          <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 3h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1z" />
        </svg>
      ),
      country: "United Kingdom",
      city: "London",
      address: "789 Government Plaza",
      services: "License Renewal, Document Processing, Tax Assistance",
      description:
        "Enhancing citizen services with efficient queue management and appointment scheduling.",
      buttonClass: "btn-outline-info",
    },
    {
      title: "First National Bank",
      headerClass: "bg-warning text-dark",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-bank"
          viewBox="0 0 16 16"
        >
          <path d="m8 0 6.61 3h.89a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H15v7a.5.5 0 0 1 .485.38l.5 2a.498.498 0 0 1-.485.62H.5a.498.498 0 0 1-.485-.62l.5-2A.501.501 0 0 1 1 13V6H.5a.5.5 0 0 1-.5-.5v-2A.5.5 0 0 1 .5 3h.89zM3.777 3h8.447L8 1zM2 6v7h1V6zm2 0v7h2.5V6zm3.5 0v7h1V6zm2 0v7H12V6zM13 6v7h1V6zm2-1V4H1v1zm-.39 9H1.39l-.25 1h13.72z" />
        </svg>
      ),
      country: "Australia",
      city: "Sydney",
      address: "321 Financial Street",
      services: "Personal Banking, Business Services, Loan Applications",
      description:
        "Optimizing customer flow and reducing perceived wait times with virtual queue management.",
      buttonClass: "btn-outline-warning",
    },
    {
      title: "Metro Shopping Center",
      headerClass: "bg-danger text-white",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-shop"
          viewBox="0 0 16 16"
        >
          <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
        </svg>
      ),
      country: "Germany",
      city: "Berlin",
      address: "567 Retail Boulevard",
      services: "Customer Service, Returns Processing, Special Orders",
      description:
        "Managing customer service interactions efficiently during peak shopping periods.",
      buttonClass: "btn-outline-danger",
    },
    {
      title: "Tech Innovation Lab",
      headerClass: "bg-secondary text-white",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-pc-display"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0M9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5M1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2z" />
        </svg>
      ),
      country: "Japan",
      city: "Tokyo",
      address: "890 Technology Park",
      services: "Consulting Sessions, Equipment Access, Testing Facilities",
      description:
        "Facilitating resource sharing and scheduling for technology researchers and developers.",
      buttonClass: "btn-outline-secondary",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return; // Exit if section is null

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");
          observer.unobserve(section); // Unobserve after adding class
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
        <div className="row g-4">
          {facilities.map((facility, index) => (
            <FacilityCard key={index} {...facility} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;

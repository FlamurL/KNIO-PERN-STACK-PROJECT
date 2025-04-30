import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Get the section element from the ref
    const section = sectionRef.current;
    if (!section) return; // Exit if section is null

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          section.classList.add("in-view");
          observer.unobserve(section); // Unobserve after adding class to prevent repeated triggers
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    // Cleanup observer on component unmount
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []); // Empty dependency array ensures effect runs only once

  return (
    <section className="hero-section" ref={sectionRef}>
      <div className="container hero-content text-center">
        <h1>Welcome To QLine</h1>
        <p>
          Join queues remotely, track progress in real-time, and receive
          notifications when it's your turn.
        </p>
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm mb-3">
              <div className="card-body text-center">
                <h5 className="card-title">Register Your Institution</h5>
                <p className="card-text">
                  Join our network and streamline your queues today
                </p>
                <a href="#" className="btn btn-success btn-lg w-100">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    to="/admin/signup"
                  >
                    Partner With Us
                  </NavLink>
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Access Your Facility Dashboard</h5>
                <p className="card-text">
                  Manage your queues and serve customers efficiently
                </p>
                <a href="#" className="btn btn-primary btn-lg w-100">
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    to="/admin/login"
                  >
                    Administrator Login
                  </NavLink>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <a href="#" className="btn btn-outline-secondary btn-lg">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

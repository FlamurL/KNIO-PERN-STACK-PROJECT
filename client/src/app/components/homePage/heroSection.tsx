import React, { useEffect, useRef } from "react";

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
        <div>
          <a href="#" className="btn btn-primary btn-lg me-2">
            Get Started
          </a>
          <a href="#" className="btn btn-outline-secondary btn-lg">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

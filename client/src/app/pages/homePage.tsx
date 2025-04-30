import React from "react";
import Navbar from "../components/homePage/navbar";

import HeroSection from "../components/homePage/heroSection";

import ContactSection from "../components/homePage/contactSection";
import Footer from "../components/homePage/footer";
import FacilitiesSection from "../components/homePage/facilitiesSelection";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FacilitiesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;

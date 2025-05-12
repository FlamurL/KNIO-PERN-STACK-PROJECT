import React from "react";
import Navbar from "../components/homePage/navbar";
import HeroSection from "../components/homePage/heroSection";
import ContactSection from "../components/homePage/contactSection";
import Footer from "../components/homePage/footer";
import FacilitiesSection from "../components/homePage/facilitiesSelection";

interface HomePageProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin";
  onLogout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  isLoggedIn,
  userRole,
  onLogout,
}) => {
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} userRole={userRole} onLogout={onLogout} />
      {!isLoggedIn && <HeroSection />}
      <FacilitiesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;

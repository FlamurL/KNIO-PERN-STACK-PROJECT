import React from "react";
import AdminFacilityPage from "../components/homePage/AdminFacilityPage/adminFacilityPage";

interface HomePageForAdminProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin";
  userName?: string;
  onLogout?: () => void;
}

const HomePageForAdmin: React.FC<HomePageForAdminProps> = ({
  isLoggedIn,
  userRole,
  userName,
  onLogout,
}) => {
  return (
    <div>
      <AdminFacilityPage
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
      />
    </div>
  );
};

export default HomePageForAdmin;

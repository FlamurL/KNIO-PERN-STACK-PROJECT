import React from "react";
import Navbar from "../components/homePage/navbar";
import JoinQueuePage from "../components/homePage/QueueManagment/QueueCard";

interface QueuePageProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin";
  userName?: string;
  onLogout?: () => void;
}

const QueuePage: React.FC<QueuePageProps> = ({
  isLoggedIn,
  userRole,
  userName,
  onLogout,
}) => {
  return (
    <div>
      <Navbar
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
      />
      <JoinQueuePage
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={onLogout}
      />
    </div>
  );
};

export default QueuePage;

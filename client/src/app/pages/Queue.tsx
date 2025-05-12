import React from "react";
import JoinQueuePage from "../components/homePage/QueueManagment/QueueCard";

interface HomePageProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin";
  onLogout: () => void;
}

const QueuePage: React.FC = () => {
  return (
    <div>
      <JoinQueuePage />
    </div>
  );
};

export default QueuePage;

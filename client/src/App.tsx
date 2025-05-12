import React, { useState, useEffect } from "react";
import { ReactElement } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import LoginPageAsAdmin from "./app/pages/loginPageAsAdmin";
import SignUpPageAsAdmin from "./app/pages/signupPageAsAdmin";
import LoginPageAsUser from "./app/pages/loginPageAsUser";
import SignUpPageAsUser from "./app/pages/signupPageAsUser";
import HomePage from "./app/pages/homePage";
import QueuePage from "./app/pages/Queue";
import UpdatePageForAdmin from "./app/pages/updatePageForAdmin";
import HomePageForAdmin from "./app/pages/homeScreenForAdmin";

interface ProtectedAdminRouteProps {
  children: ReactElement;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (!adminToken || userRole !== "admin") {
      navigate("/admin/login");
    }
  }, [adminToken, userRole, navigate]);

  return adminToken && userRole === "admin" ? children : null;
};
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(
    undefined
  );

  useEffect(() => {
    // Check for tokens on mount to set initial login state
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken) {
      setIsLoggedIn(true);
      setUserRole("user");
    } else if (adminToken) {
      setIsLoggedIn(true);
      setUserRole("admin");
    } else {
      setIsLoggedIn(false);
      setUserRole(undefined);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("facilityId");
    setIsLoggedIn(false);
    setUserRole(undefined);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            <LoginPageAsAdmin
              setLoggedIn={setIsLoggedIn}
              setUserRole={setUserRole}
            />
          }
        />
        <Route path="/admin/signup" element={<SignUpPageAsAdmin />} />
        <Route
          path="/user/login"
          element={
            <LoginPageAsUser
              setLoggedIn={setIsLoggedIn}
              setUserRole={setUserRole}
            />
          }
        />
        <Route path="/user/signup" element={<SignUpPageAsUser />} />
        <Route path="/user/queue" element={<QueuePage />} />
        <Route
          path="/admin/home"
          element={
            <ProtectedAdminRoute>
              <HomePageForAdmin />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/update"
          element={
            <ProtectedAdminRoute>
              <UpdatePageForAdmin />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

interface NavbarProps {
  isLoggedIn: boolean;
  userRole?: "user" | "admin"; // Optional: Indicate user role
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, userRole, onLogout }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const closeNavbar = () => setIsOpen(false);

  const loggedInNavbar = (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/" onClick={closeNavbar}>
          Queue System
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to={
                  userRole === "admin" ? "/admin/dashboard" : "/user/dashboard"
                }
                onClick={closeNavbar}
              >
                Dashboard
              </NavLink>
            </li>
            {onLogout && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={onLogout}
                >
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );

  const defaultNavbar = (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/" onClick={closeNavbar}>
          Queue System
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/"
                onClick={closeNavbar}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/user/signup"
                onClick={closeNavbar}
              >
                Sign Up
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                to="/user/login"
                onClick={closeNavbar}
              >
                Log In
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );

  return <>{isLoggedIn ? loggedInNavbar : defaultNavbar}</>;
};

export default Navbar;

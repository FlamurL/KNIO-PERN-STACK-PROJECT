import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPageAsAdmin from "./app/pages/loginPageAsAdmin";
import SignUpPageAsAdmin from "./app/pages/signupPageAsAdmin";
import LoginPageAsUser from "./app/pages/loginPageAsUser";
import SignUpPageAsUser from "./app/pages/signupPageAsUser";
import HomePage from "./app/pages/homePage";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<LoginPageAsAdmin />} />
        <Route path="/admin/signup" element={<SignUpPageAsAdmin />} />
        <Route path="/user/login" element={<LoginPageAsUser />} />
        <Route path="/user/signup" element={<SignUpPageAsUser />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import LoginPage from "./app/pages/loginPage";
import SignUpPage from "./app/pages/signupPage";
import HomePage from "./app/pages/homePage";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element ={<HomePage />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default App;

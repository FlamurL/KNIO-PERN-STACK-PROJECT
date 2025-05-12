import React from "react";
import AdminLogin from "../components/loginAsAdmin/login"; // Assuming AdminLogin component is in this path

interface LoginPageAsAdminProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<
    React.SetStateAction<"user" | "admin" | undefined>
  >;
}

const LoginPageAsAdmin: React.FC<LoginPageAsAdminProps> = ({
  setLoggedIn,
  setUserRole,
}) => {
  return (
    <div>
      <AdminLogin setLoggedIn={setLoggedIn} setUserRole={setUserRole} />
    </div>
  );
};

export default LoginPageAsAdmin;

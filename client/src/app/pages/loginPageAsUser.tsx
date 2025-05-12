import React from "react";
import LoginAsUser from "../components/loginAsUser/login"; // Assuming LoginAsUser component is in this path

interface LoginPageAsUserProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<
    React.SetStateAction<"user" | "admin" | undefined>
  >;
}

const LoginPageAsUser: React.FC<LoginPageAsUserProps> = ({
  setLoggedIn,
  setUserRole,
}) => {
  return (
    <div>
      <LoginAsUser setLoggedIn={setLoggedIn} setUserRole={setUserRole} />
    </div>
  );
};

export default LoginPageAsUser;

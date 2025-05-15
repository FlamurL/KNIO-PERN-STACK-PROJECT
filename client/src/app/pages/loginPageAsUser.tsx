import React from "react";
import LoginAsUser from "../components/loginAsUser/login"; // Adjust path as needed

interface LoginPageAsUserProps {
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserRole: React.Dispatch<
    React.SetStateAction<"user" | "admin" | undefined>
  >;
  setUserName: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const LoginPageAsUser: React.FC<LoginPageAsUserProps> = ({
  setLoggedIn,
  setUserRole,
  setUserName,
}) => {
  return (
    <div>
      <LoginAsUser
        setLoggedIn={setLoggedIn}
        setUserRole={setUserRole}
        setUserName={setUserName}
      />
    </div>
  );
};

export default LoginPageAsUser;

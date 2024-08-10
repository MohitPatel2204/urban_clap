import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import userT from "../types/userT";

export interface IAuth {
  login: () => void;
}
const AuthContext = createContext<IAuth | any>(null);

export const AuthProvider = (props: { children: JSX.Element }) => {
  const user = localStorage.getItem("creads");

  const navigate = useNavigate();

  const login = async (user: userT) => {
    localStorage.setItem("creads", JSON.stringify(user));

    if (user.is_staff) {
      navigate("/dashboard");
    } else if (user.is_superuser) {
      navigate("/dashboard");
    } else {
      navigate("/all-services");
    }
  };

  const value = useMemo(
    () => ({
      login,
      user,
    }),
    []
  );
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

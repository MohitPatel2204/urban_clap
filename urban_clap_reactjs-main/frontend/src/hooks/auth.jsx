import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsSuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("creads");
    if (user) {
      setIsSuthenticated(true);
    } else {
      setIsSuthenticated(false);
    }
  }, []);
  return isAuthenticated;
};
export default useAuth;

export const ProtectedRoutes = ({ element }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? element : <Navigate to="/signin" />;
};

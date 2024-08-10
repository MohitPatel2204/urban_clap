import { Navigate } from "react-router-dom";
import { useAuth } from "./UseAuth";

export const ProtectedRoutes = (props: { element: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return props.element;
};

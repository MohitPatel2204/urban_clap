import { Navigate } from "react-router-dom";
import { IAuth, useAuth } from "./UseAuth";

export const ProtectedRoutes = (props: { element: JSX.Element }) => {
  const user: IAuth | null = useAuth();
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return props.element;
};

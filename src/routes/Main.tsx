import { authroute } from "./Authroutes";
import { AuthProvider } from "../hooks/UseAuth";
import { useRoutes } from "react-router-dom";
import { ProtectedRoutes } from "../hooks/ProtectedRoutes";
import Layout from "../layouts/Layout";
import "bootstrap/dist/css/bootstrap.css";
import servicesRoutes from "./Serviceprovider";
import Admin from "./Admin";
import "../pages/customers/showservices.css";
import Customer from "./Customer";
import "../pages/spiner.css";
import React from "react";

const Main = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <ProtectedRoutes element={<Layout />}></ProtectedRoutes>,
      children: [...servicesRoutes, ...Admin, ...Customer],
    },
    ...authroute,
  ]);
  return (
    <AuthProvider>
      <React.Fragment>{routes}</React.Fragment>
    </AuthProvider>
  );
};

export default Main;

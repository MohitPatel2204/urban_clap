import React from "react";
import Login from "../pages/Authentication/login/Login";
import Registation from "../pages/Authentication/registration/Registation";
import Forgetpassword from "../pages/Authentication/forgetpassword/Forgetpassword";
import Resetpassword from "../pages/Authentication/forgetpassword/Resetpassword";
import Header from "../layouts/header/Header";
import Profiles from "../pages/Authentication/Profiles";

export const authroute = [
  {
    path: "",
    element: <Header />,
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Registation />,
  },
  {
    path: "/forget-password",
    element: <Forgetpassword />,
  },
  {
    path: "/reset_password",
    element: <Resetpassword />,
  },
  {
    path: "/profile",
    element: <Profiles />,
  },
];

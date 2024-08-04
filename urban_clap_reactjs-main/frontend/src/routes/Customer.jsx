// import { Dashboard } from "@mui/icons-material";
import React from "react";
import ShowServices from "../pages/customers/ShowServices";
import AddAppointment from "../pages/customers/AddAppointment";
import AppointmentStatus from "../pages/customers/AppointmentStatus";
import ShowReviews from "../pages/customers/ShowReviews";
import AddReview from "../pages/customers/AddReview";

const Customer = [
  {
    path: "/all-services",
    element: <ShowServices />,
  },
  {
    path: "/book-appointment",
    element: <AddAppointment />,
  },
  {
    path: "/status",
    element: <AppointmentStatus />,
  },
  {
    path: "/reviews",
    element: <ShowReviews />,
  },
  {
    path: "/addreview",
    element: <AddReview />,
  },
];

export default Customer;

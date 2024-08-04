import Addcategory from "../pages/serviceproviders/Addcategory";
import Addservices from "../pages/serviceproviders/Addservices";
import Addslot from "../pages/serviceproviders/Addslot";
import Appointment from "../pages/serviceproviders/Appointment";
import Category from "../pages/serviceproviders/Category";
import Dashboard from "../pages/serviceproviders/Dashboard";
import Showservices from "../pages/serviceproviders/Showservices";
import Slot from "../pages/serviceproviders/Slot";

const servicesRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/addservices",
    element: <Addservices />,
  },
  {
    path: "/services",
    element: <Showservices />,
  },
  {
    path: "/category",
    element: <Category />,
  },
  {
    path: "/addcategory",
    element: <Addcategory />,
  },
  {
    path: "/appointment",
    element: <Appointment />,
  },
  {
    path: "/slot",
    element: <Slot />,
  },
  {
    path: "/addslot",
    element: <Addslot />,
  },
];

export default servicesRoutes;

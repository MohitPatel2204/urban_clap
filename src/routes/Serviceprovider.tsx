import { ProtectedRoutes } from "../hooks/ProtectedRoutes";
import Profiles from "../pages/Authentication/Profiles";
import Notification from "../pages/customers/Notifications";
import Addcategory from "../pages/serviceproviders/Addcategory";
import Addservices from "../pages/serviceproviders/Addservices";
import Addslot from "../pages/serviceproviders/Addslot";
import Appointment from "../pages/serviceproviders/Appointment";
import Category from "../pages/serviceproviders/Category";
import Dashboard from "../pages/serviceproviders/Dashboard";
import Showservices from "../pages/serviceproviders/Showservices";
import Slot from "../pages/serviceproviders/Slot";

const servicesRoutes: Array<{
  path: string;
  element: JSX.Element;
}> = [
  {
    path: "dashboard",
    element: <ProtectedRoutes element={<Dashboard />} />,
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
  {
    path: "/notification",
    element: <Notification />,
  },
  {
    path: "/profile",
    element: <Profiles />,
  },
];

export default servicesRoutes;

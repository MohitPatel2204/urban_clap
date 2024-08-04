import { useRoutes } from "react-router-dom";

import servicesRoutes from "./Serviceprovider";
import { authroute } from "./Authroutes";
import Customer from "./Customer";
import Admin from "./Admin";

const Main = () => {
  const routes = useRoutes([
    ...authroute,
    ...servicesRoutes,
    ...Customer,
    ...Admin,
  ]);
  return routes;
};

export default Main;

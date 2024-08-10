import ResponsiveAppBar from "./header/ResponsiveAppBar";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

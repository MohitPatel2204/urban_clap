import React from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import Chart from "./Chart";
import { useSelector } from "react-redux";
import AdminDashboard from "../admin/AdminDashboard";

const Dashboard = () => {
  let reduxdata = useSelector((state) => state.user?.text);
  // console.log(reduxdata);
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          {reduxdata?.pk == 1 ? (
            <AdminDashboard />
          ) : reduxdata?.is_staff == true ? (
            <Chart />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

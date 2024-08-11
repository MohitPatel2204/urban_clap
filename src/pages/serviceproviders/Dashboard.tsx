import Chart from "./Chart";
import { useSelector } from "react-redux";
import AdminChart from "../admin/AdminChart";
import userT from "../../types/userT";

const Dashboard = () => {
  const reduxdata = useSelector(
    (state: { user: { text: userT } }) => state.user?.text
  );
  return (
    <div>
      {reduxdata?.pk == 1 ? (
        <AdminChart />
      ) : 
      reduxdata?.is_staff == true ? (
        <Chart />
      ) : (
        ""
      )}
    </div>
  );
};

export default Dashboard;

import Chart from "./Chart";
import { useSelector } from "react-redux";
import AdminChart from "../admin/AdminChart";
import userT from "../../types/userT";

const Dashboard = () => {
  let reduxdata = useSelector(
    (state: { user: { text: userT } }) => state.user?.text
  );
  return (
    <div>
      {reduxdata?.pk == 1 ? (
        <AdminChart />
      ) : // <div
      //   style={{
      //     display: "flex",
      //     justifyContent: "center",
      //     margin: "27% auto",
      //   }}
      // >
      //   {" "}
      //   <Spinner />
      // </div>
      reduxdata?.is_staff == true ? (
        <Chart />
      ) : (
        ""
      )}
    </div>
  );
};

export default Dashboard;

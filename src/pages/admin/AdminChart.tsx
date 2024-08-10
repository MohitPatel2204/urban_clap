import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
import axios from "axios";
import { getData } from "../../services/axiosrequests";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

interface dataT {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }
  ];
}
interface countT {
  emp: number;
  cs: number;
  c: number;
}

const AdminChart = () => {
  const [data, setData] = useState<dataT>({} as dataT);
  const [counts, setCounts] = useState<countT>({} as countT);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(
          `${import.meta.env.VITE_API_URL}top-service-providers/`
        );
        const labels = response.context.top_providers?.map(
          (provider: { service__user__username: string }) =>
            provider.service__user__username
        );
        const bookingCounts = response.context.top_providers?.map(
          (provider: { booking_count: number }) => provider.booking_count
        );

        setData({
          labels,
          datasets: [
            {
              label: "Number of Bookings",
              data: bookingCounts,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
        setCounts({
          emp: response?.context?.sp_count,
          cs: response?.context?.cs_count,
          c: response?.context?.c_count,
        });
      } catch (error) {
        console.error("Error fetching top service providers:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-center mt-3">
        <div
          className="card text-center mx-4 border button"
          style={{ backgroundColor: "#c9f7ff" }}
        >
          <Link
            to={"/serviceproviders"}
            className="link-offset-2 link-underline link-underline-opacity-0"
          >
            <div className="card-body my-3 text-dark">
              <p className="card-text h1 ">Employees</p>
              <h5 className="card-title ">{counts?.emp}</h5>
            </div>
          </Link>
        </div>
        <div
          className="card text-center mx-4 border button"
          style={{ backgroundColor: "#ffff80" }}
        >
          <Link
            to={"/customers"}
            className="link-offset-2 link-underline link-underline-opacity-0"
          >
            <div className="card-body my-3 text-dark">
              <p className="card-text h1">Customers</p>
              <h5 className="card-title ">{counts?.cs}</h5>
            </div>
          </Link>
        </div>
        <div
          className="card text-center mx-4 border button"
          style={{ backgroundColor: "#bfffbf" }}
        >
          <Link
            to={"/category"}
            className="link-offset-2 link-underline link-underline-opacity-0"
          >
            <div className="card-body my-3 text-dark">
              <p className="card-text h1">Categorys</p>
              <h5 className="card-title ">{counts?.c}</h5>
            </div>
          </Link>
        </div>
      </div>
      <h3 className="text-center mb-3">Top 10 Service Providers</h3>
      {Object.keys(data).length != 0 ? (
        <Bar data={data} style={{ width: "120dvh" }} className="mb-5" />
      ) : null}
    </div>
  );
};
export default AdminChart;

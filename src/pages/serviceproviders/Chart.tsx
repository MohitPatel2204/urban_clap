import React, { useEffect, useState } from "react";
import { getData } from "../../services/axiosrequests";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Chart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Appointment per Month",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  });
  const [services, setServices] = useState({
    labels: [],
    datasets: [
      {
        label: "Appointment per Month",
        data: [],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  });
  const [pieChart, setPieChart] = useState({
    labels: ["Approved", "Rejected"],
    datasets: [
      {
        data: [0, 0],
        borderColor: [
          "rgba(75,192,192,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(255,206,86,0.6)",
        ],
        backgroundColor: [
          "rgba(75,192,192,0.2)",
          "rgba(255,99,132,0.6)",
          "rgba(255,206,86,0.6)",
        ],
        borderWidth: 1,
      },
    ],
  });
  let storedata = JSON.parse(localStorage.getItem("creads") || "''");

  const fetchData = async () => {
    try {
      const response = await getData(
        `${import.meta.env.VITE_API_URL}appointment-status-chart/`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setChartData({
        labels: response.context[1].months,
        datasets: [
          {
            label: "Appointment per Month",
            data: response.context[1].counts,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: false,
            tension: 0.1,
          },
        ],
      });
      setServices({
        labels: response.context[2].services,
        datasets: [
          {
            label: "Appointment per Month",
            data: response.context[2].counts,
            borderColor: "rgba(75,120,120,1)",
            backgroundColor: "rgba(75,190,190,0.5)",
            fill: false,
            tension: 0.1,
          },
        ],
      });
      setPieChart({
        labels: ["Approved", "Rejected"],
        datasets: [
          {
            data: [
              response.context[0].status_data.Approved,
              response.context[0].status_data.Rejected,
            ],
            borderColor: [
              "rgba(75,192,192,0.6)",
              "rgba(255,99,132,0.6)",
              //   "rgba(255,206,86,0.6)",
            ],
            backgroundColor: [
              "rgba(75,192,192,0.2)",
              "rgba(255,99,132,0.6)",
              //   "rgba(255,206,86,0.6)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error: any) {
      console.log(error.response);
      // setChartData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="row mt-5" style={{ margin: "auto" }}>
        <div className="col-md-6" style={{ width: "50%", margin: "auto" }}>
          <p className="text-center">Appointment Per Month</p>
          <Line data={chartData} />
        </div>
        <div className="col-md-6 mt-3" style={{ width: "50%", margin: "auto" }}>
          <p className="text-center">Appointment Per Services</p>
          <Bar data={services} />
        </div>
      </div>
      <div className="row mt-5" style={{ margin: "auto" }}>
        <div className="col-md-6" style={{ width: "40%", margin: "auto" }}>
          <p className="text-center">Appointment Status</p>
          <Pie data={pieChart} />
        </div>
      </div>
    </div>
  );
};

export default Chart;

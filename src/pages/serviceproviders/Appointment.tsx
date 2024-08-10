import { useEffect, useState } from "react";
import { getData, patchData } from "../../services/axiosrequests";

interface appoinmetT {
  service: { description: string };
  work_date: any;
  area: { name: string };
  slot: { slot: string };
  is_cancel: any;
  is_accept: any;
  id: number;
}

const Appointment = () => {
  const [appoinmets, setAppointment] = useState([]);
  let storedata = JSON.parse(localStorage.getItem("creads") || "''");
  let config = {
    headers: { Authorization: `Bearer ${storedata.access}` },
  };
  const handleApproved = async (id: number) => {
    try {
      setAppointment(appoinmets.filter((ap: { id: number }) => ap.id != id));
      const response = await patchData(
        `${import.meta.env.VITE_API_URL}appointment/${id}/`,
        {
          is_accept: true,
        },
        config
      );
    } catch (err: any) {
      if (Object.keys(err.response.data.context)) {
        console.log(err.response.data.context);
      }
    }
  };
  const handleReject = async (id: number) => {
    try {
      setAppointment(appoinmets.filter((ap: { id: number }) => ap.id != id));
      const response = await patchData(
        `${import.meta.env.VITE_API_URL}appointment/${id}/`,
        {
          is_cancel: true,
        },
        config
      );
    } catch (err: any) {
      if (Object.keys(err.response.data.context)) {
        console.log(err.response.data.context);
      }
    }
  };

  const handleFilter = async (data: {
    is_cancel: any;
    future: any;
    is_accept: any;
  }) => {
    try {
      const response = await getData(
        `${import.meta.env.VITE_API_URL}appointmentreader/?is_cancel=${
          data.is_cancel
        }&is_future=${data.future}&is_accept=${data.is_accept}`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setAppointment(response.context);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  const fetchData = async () => {
    if (appoinmets.length == 0) {
      try {
        const response = await getData(
          `${import.meta.env.VITE_API_URL}appointmentreader/`,
          {
            headers: { Authorization: `Bearer ${storedata.access}` },
          }
        );
        setAppointment(response.context);
      } catch (error: any) {
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="div fs-3 text-center text-primary">Appointments</div>
      <div className="row">
        <div
          className="col-md-2"
          onClick={() => {
            handleFilter({
              future: true,
              is_cancel: true,
              is_accept: "",
            });
          }}
        >
          <p className="btn btn-success">Rejected Appointment</p>
        </div>
        <div
          className="col-md-2"
          onClick={() => {
            handleFilter({
              future: true,
              is_cancel: "",
              is_accept: true,
            });
          }}
        >
          <p className="btn btn-success">Approve Appointment</p>
        </div>
        <div
          className="col-md-2"
          onClick={() => {
            handleFilter({
              future: true,
              is_cancel: "",
              is_accept: "",
            });
          }}
        >
          <p className="btn btn-success">Pending Appointment</p>
        </div>
        <div
          className="col-md-2"
          onClick={() => {
            handleFilter({
              future: "",
              is_cancel: true,
              is_accept: "",
            });
          }}
        >
          <p className="btn btn-danger">Past Rejected Appointment</p>
        </div>
        <div
          className="col-md-2"
          onClick={() => {
            handleFilter({
              future: "",
              is_cancel: "",
              is_accept: true,
            });
          }}
        >
          <p className="btn btn-danger">Past Approve Appointment</p>
        </div>
        <div
          className="col-md-2"
          onClick={() => {
            handleFilter({
              future: "",
              is_cancel: "",
              is_accept: "",
            });
          }}
        >
          <p className="btn btn-danger">Past Pending Appointment</p>
        </div>
      </div>
      <div
        className="row d-flex"
        style={{
          padding: "5px",
          width: "98%",
          margin: "3% 10%",
        }}
      >
        {appoinmets.map((singleap: appoinmetT, key) => (
          <div
            key={key}
            className="custom-card col-md-3 mb-4 shadow-lg p-3 mb-5 bg-white rounded"
            style={{ marginRight: "3%" }}
          >
            <div className="col mb-1">
              UserName : <span>hello</span>
            </div>
            <div className="col mb-1">
              Service : <span>{singleap.service.description}</span>
            </div>
            <div className="col mb-1">
              Date : <span>{singleap.work_date}</span>
            </div>
            <div className="col mb-1">
              Area : <span>{singleap.area.name}</span>
            </div>
            <div className="col mb-1">
              Slot : <span>{singleap.slot.slot}</span>
            </div>

            {singleap.is_cancel ? (
              <div className="text-danger text-center">Rejected</div>
            ) : singleap.is_accept ? (
              <div className="text-success text-center">Approved</div>
            ) : new Date(new Date().toDateString()) >
              new Date(singleap.work_date) ? (
              <div className="text-center text-danger">Past Pending</div>
            ) : (
              <div className="col d-flex gap-5">
                <p
                  className="btn btn-primary"
                  onClick={() => {
                    handleApproved(singleap.id);
                  }}
                >
                  Approve
                </p>
                <p
                  className="btn btn-danger"
                  onClick={() => {
                    handleReject(singleap.id);
                  }}
                >
                  Reject
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointment;

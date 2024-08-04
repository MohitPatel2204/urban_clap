import React, { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import debounce from "lodash.debounce";
import { getData, patchData } from "../../services/axiosrequests";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AppointmentStatus = () => {
  const [appointment, setApoointment] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [user, setUser] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  let userreduxdata = useSelector((state) => state.user);

  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${
          import.meta.env.VITE_API_URL
        }appointmentpagination/?page=${page}&search=${query}&user=${
          user == "" && location.state?.id == undefined
            ? ""
            : user == ""
            ? location.state?.id
            : user
        }`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setApoointment(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 2));
    }, 500),
    []
  );

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setCurrentPage(1);
    debouncedSearch(currentPage, event.target.value);
  };

  useEffect(() => {
    if (location.state?.id != "") {
      setUser(location.state?.id);
    }

    debouncedSearch(currentPage, inputValue);
  }, [currentPage, debouncedSearch]);

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCancel = (id) => {
    try {
      // update data base value is_cancel_user
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success btn-gap",
          cancelButton: "btn btn-danger btn-gap",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, cancel it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const cancelApoointmnet = appointment.map((single) => {
              if (single.id == id) {
                single.is_user_cancel = true;
                return single;
              } else {
                return single;
              }
            });
            setApoointment(cancelApoointmnet);
            let storedata = JSON.parse(localStorage.getItem("creads"));
            let config = {
              headers: { Authorization: `Bearer ${storedata.access}` },
            };
            const response = await patchData(
              `${import.meta.env.VITE_API_URL}appointment/${id}/`,
              { is_user_cancel: "true" },
              config
            );
            swalWithBootstrapButtons
              .fire({
                title: "Deleted!",
                text: "Category Deleted...!",
                icon: "success",
              })
              .then(async (result2) => {});
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Request Not Canceled)",
              icon: "error",
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          <div className="text-center fs-3 text-primary">
            Appointment Status
          </div>
          {userreduxdata?.text?.pk == 1 && (
            <div
              className="text-center btn btn-danger "
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </div>
          )}
          <div className="mb-4 mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          {appointment.length == 0 ? (
            <div className="fs-3 text-danger col-12 text-center mt-5">
              No Data Found
            </div>
          ) : (
            <>
              <div className="collection  p-3">
                <div className="row mb-4 p-1">
                  <div className="col-md-2">Service</div>
                  <div className="col-md-2">Date Of Work</div>
                  <div className="col-md-2">Service Price</div>
                  <div className="col-md-4 text-center">Status</div>
                </div>
                {appointment.map((app, key) => (
                  <div className="row mb-3" key={key}>
                    <div className="col-md-2">{app.service.description}</div>
                    <div className="col-md-2">{app.work_date}</div>
                    <div className="col-md-2">{app.service.price}</div>

                    {app.is_user_cancel == true ? (
                      <div className="col-md-4 text-center bg-dark text-white rounded-pill p-1">
                        Cancel By You
                      </div>
                    ) : app.is_accept == true &&
                      app.is_service_completed == false ? (
                      <div className="col-md-2 text-center bg-primary text-white rounded-pill p-1">
                        Aceepted
                      </div>
                    ) : app.is_accept == true &&
                      app.is_service_completed == true ? (
                      <div className="col-md-4 text-center bg-success text-white rounded-pill p-1 ">
                        Completed
                      </div>
                    ) : app.is_cancel == true ? (
                      <div className="col-md-4 text-center bg-danger text-white rounded-pill p-1">
                        Rejected
                      </div>
                    ) : (
                      <div className="col-md-2 text-center bg-info text-white rounded-pill p-1">
                        Pending
                      </div>
                    )}
                    {app.is_cancel != true &&
                    app.is_user_cancel != true &&
                    app.is_service_completed != true ? (
                      <div
                        className="col-md-2 text-center btn btn-danger rounded-pill p-1"
                        onClick={() => {
                          handleCancel(app.id);
                        }}
                      >
                        Cancel Request
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
              <div className="buttons d-flex gap-3">
                <button
                  className="btn btn-primary"
                  onClick={handlePrev}
                  disabled={currentPage == 1}
                >
                  Prev
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={currentPage === totalPage}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentStatus;

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import userT from "../../types/userT";
import { debounce } from "lodash";
import SerachBox from "../../components/common/FormController/SerachBox";
import useAxois from "../../hooks/axois";
import { toast } from "react-toastify";
import Toast from "../../components/common/Toast";
import React from "react";

type appoimentT = {
  id?: number;
  service: { description: string; price?: number };
  work_date?: string;
  is_user_cancel?: boolean;
  is_accept?: boolean;
  is_cancel?: boolean;
  is_service_completed?: boolean;
};

const AppointmentStatus = () => {
  const [appointment, setApoointment] = useState<Array<appoimentT>>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [user, setUser] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const userreduxdata = useSelector(
    (state: { user: { text: userT } }) => state.user
  );
  const { axoisGet, axiosPatch } = useAxois();
  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      try {
        const response = await axoisGet("appointmentpagination/", {
          page,
          search: query,
          user:
            user == "" && location.state?.id == undefined
              ? ""
              : user == ""
              ? location.state?.id
              : user,
        });
        setApoointment(response.context?.results);
        setTotalPage(Math.ceil(response.context.count / 2));
      } catch (error) {
        toast.error((error as Error).message);
      }
    }, 500),
    []
  );

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setCurrentPage(1);
    debouncedSearch(currentPage, value);
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

  const handleCancel = (id: number) => {
    try {
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
              if (single.id === id) {
                single.is_user_cancel = true;
                return single;
              } else {
                return single;
              }
            });
            setApoointment(cancelApoointmnet);
            await axiosPatch(
              `appointment/${id}/`,
              { is_user_cancel: "true" },
              false
            );
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Category Deleted...!",
              icon: "success",
            });
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
    <React.Fragment>
      <Toast></Toast>
      <div className="fs-4 text-center mb-5 mt-2">Appointment Status</div>
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
        <SerachBox
          className="form-control"
          placeholder="search here"
          value={inputValue}
          onChange={handleInputChange}
          name={"search"}
        />
      </div>
      {appointment.length == 0 ? (
        <div className="fs-3 text-danger col-12 text-center mt-5">
          No Data Found
        </div>
      ) : (
        <React.Fragment>
          <div className="collection  p-3">
            <div className="row mb-4 p-1">
              <div className="col-md-2">Service</div>
              <div className="col-md-2">Date Of Work</div>
              <div className="col-md-2">Service Price</div>
              <div className="col-md-4 text-center">Status</div>
            </div>
            {appointment.map((app: appoimentT, key) => (
              <div className="row mb-3" key={`apoiment_${key}`}>
                <div className="col-md-2">{app?.service?.description}</div>
                <div className="col-md-2">{app.work_date}</div>
                <div className="col-md-2">{app?.service?.price}</div>
                {app.is_user_cancel === true ? (
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
                      handleCancel(app.id as number);
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
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              className="button"
              onClick={handlePrev}
              disabled={currentPage == 1}
            >
              Prev
            </button>
            <button
              className="button"
              onClick={handleNext}
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default AppointmentStatus;

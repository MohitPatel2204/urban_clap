import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import { deleteData, getData } from "../../services/axiosrequests";
import Sidebar from "../../layouts/sidebar/Sidebar";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { debounce } from "lodash";
import { useSelector } from "react-redux";

// import Searching from "./Searching";

const Showservices = () => {
  let [services, setServices] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [user, setUser] = useState("");
  let userreduxdata = useSelector((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  const handleUpdate = (data) => {
    navigate("/Addservices", {
      state: data,
    });
  };
  const handleAddServices = () => {
    navigate("/Addservices", {
      state: {
        category: "",
        area: [],
        description: "",
        price: "",
        slot: [],
      },
    });
  };

  const handleDelete = (id) => {
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
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          services = services.filter((service) => {
            return service.id != id;
          });
          setServices(services);
          let storedata = JSON.parse(localStorage.getItem("creads"));
          let config = {
            headers: { Authorization: `Bearer ${storedata.access}` },
          };
          const response = await deleteData(
            `${import.meta.env.VITE_API_URL}services/${id}/`,
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
            text: "Your data is safe :)",
            icon: "error",
          });
        }
      });
  };

  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${
          import.meta.env.VITE_API_URL
        }services/?page=${page}&search=${query}&user=${
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
      setServices(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 2));
    }, 500),
    []
  );
  // };

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
  }, [currentPage, debouncedSearch, user]);

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
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div
          className="add-form"
          style={{ padding: "10px", marginLeft: "22%", width: "75%" }}
        >
          {userreduxdata?.text.pk == 1 && (
            <div
              className="text-center btn btn-danger "
              onClick={() => {
                navigate(-1);
              }}
            >
              Back
            </div>
          )}
          <div className="text-center fs-3 text-primary">Services</div>
          <div className="add">
            {location.state?.id == undefined ? (
              <p
                className="btn btn-primary"
                onClick={() => {
                  handleAddServices();
                }}
              >
                Add Services
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="mb-4 mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          {services.length == 0 ? (
            <div className="fs-3 text-danger col-12 text-center mt-5">
              No Data Found
            </div>
          ) : (
            <>
              <table style={{ width: "100%", padding: "5px", height: "50%" }}>
                <tbody>
                  <tr>
                    <th>Id</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>

                  {services.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td>{item.id}</td>
                        <td>{item.description}</td>
                        <td>{item.price}</td>
                        <td>
                          <p
                            onClick={() =>
                              handleUpdate({
                                id: item.id,
                                category: item.category,
                                area: item.area,
                                description: item.description,
                                price: item.price,
                                slot: item.slot,
                              })
                            }
                            className="btn btn-primary"
                          >
                            Update
                          </p>
                        </td>
                        <td>
                          <p
                            className="btn btn-danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

export default Showservices;

import React, { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { getData } from "../../services/axiosrequests";

const ShowCustomers = () => {
  let [customer, setCustomer] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${
          import.meta.env.VITE_API_URL
        }userdata/?type=customer&page=${page}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setCustomer(response.context?.results);
      setTotalPage(Math.ceil(response.context.count / 6));
    }, 500),
    []
  );
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setCurrentPage(1);
    debouncedSearch(currentPage, event.target.value);
  };
  useEffect(() => {
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

  const handleClick = (id) => {
    navigate("/status", {
      state: { id: id },
    });
  };
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div
          className="add-form row"
          style={{ marginLeft: "22%", width: "75%" }}
        >
          <div
            className="text-center fs-3 mt-3 "
            style={{ fontWeight: "bold" }}
          >
            Customers
          </div>
          <div className="mb-4 mt-3">
            <input
              type="text"
              value={inputValue}
              className="form-control"
              onChange={handleInputChange}
              placeholder="serach here"
            />
          </div>
          {customer?.map((single, key) => (
            <div
              className="container bootstrap snippets bootdey col-md-4 "
              style={{ margin: "2% auto" }}
              key={key}
            >
              <div className="col-md-12 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="box-info text-center user-profile-2">
                  <div className="user-profile-inner">
                    <h4 className="text-balck">{single.username}</h4>
                    <img
                      src={single?.profile[0]?.profile_photo}
                      className="rounded-circle img-fluid"
                      alt="Not Found"
                      style={{
                        borderRadius: "50px",
                        width: "50%",
                        height: "20dvh",
                      }}
                    />
                    <h5>Service Provider</h5>
                    <div className="user-button">
                      <div className="row">
                        <div className="col-12 mb-2">
                          <div
                            onClick={() => handleClick(single.pk)}
                            className="button"
                          >
                            <i className="fa fa-envelope"></i> Show services
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        </div>
      </div>
    </div>
  );
};

export default ShowCustomers;
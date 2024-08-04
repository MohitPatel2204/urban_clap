import React, { useCallback, useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import { getData } from "../../services/axiosrequests";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import "./showservices.css";

const ShowServices = () => {
  const [allServices, setAllServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      const storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${
          import.meta.env.VITE_API_URL
        }service-filter/?page=${page}&search=${query}`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      const newrow = response.context?.results.map(convertRow);
      setAllServices(newrow);
      setTotalPage(Math.ceil(response.context.count / 2));
    }, 500),
    []
  );

  const convertRow = (data) => ({
    id: data.id,
    rating: data.average_rating,
    servicedescription: data.description,
    price: data.price,
    serviceprovider: data.user.username,
    sp_id: data.user.id,
    servicecategory: data.category.name,
    areas: data.area.map((area) => ({ id: area.id, name: area.name })),
    slots: data.slot.map((slot) => ({ id: slot.id, name: slot.slot })),
  });

  useEffect(() => {
    debouncedSearch(currentPage, inputValue);
  }, [currentPage, inputValue, debouncedSearch]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setCurrentPage(1);
    debouncedSearch(1, event.target.value);
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleUpdate = (data) => {
    navigate("/book-appointment", { state: data });
  };

  const handleShowReview = (data) => {
    navigate("/reviews", { state: data });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          <div className="text-center fs-3 mt-3 " style={{fontWeight:'bold'}}>Services</div>

          <div className="mb-4 mt-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search services..."
              className="form-control"
            />
          </div>

          {allServices.map((item) => (
            <div key={item.id} className="service-card">
              <div className="header">{item.servicedescription}</div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Rating:</strong>
                </div>
                <div className="col-md-6">{item.rating}</div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Price:</strong>
                </div>
                <div className="col-md-6">{item.price}</div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Service Provider:</strong>
                </div>
                <div className="col-md-6">{item.serviceprovider}</div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Category:</strong>
                </div>
                <div className="col-md-6">{item.servicecategory}</div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Slots:</strong>
                </div>
                <div className="col-md-6">
                  {item.slots.map((slot) => (
                    <div key={slot.id}>{slot.name}</div>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>Areas:</strong>
                </div>
                <div className="col-md-6">
                  {item.areas.map((area) => (
                    <div key={area.id}>{area.name}</div>
                  ))}
                </div>
              </div>
              <div className="button-container">
                <button
                  className="button"
                  onClick={() =>
                    handleUpdate({
                      service: item.id,
                      slot: item.slots,
                      area: item.areas,
                      work_date: "",
                    })
                  }
                >
                  Book Appointment
                </button>
                <button
                  className="button"
                  onClick={() => handleShowReview({ id: item.id })}
                >
                  Show Reviews
                </button>
              </div>
            </div>
          ))}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              className="button"
              onClick={handlePrev}
              disabled={currentPage === 1}
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

export default ShowServices;

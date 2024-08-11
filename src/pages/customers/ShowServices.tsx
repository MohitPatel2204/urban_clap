import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import "./showservices.css";
import { Rating } from "@mui/material";
import Spinner from "../spiner";
import SerachBox from "../../components/common/FormController/SerachBox";
import useAxois from "../../hooks/axois";
import { toast } from "react-toastify";

const ShowServices = () => {
  const [allServices, setAllServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loader, setLoader] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const { axoisGet } = useAxois();
  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      try {
        setLoader(false);
        const response = await axoisGet("service-filter/", {
          page,
          search: query,
        });
        const newrow = response.context?.results.map(convertRow);
        setAllServices(newrow);
        setTotalPage(Math.ceil(response.context.count / 2));
        setLoader(true);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoader(true);
      }
    }, 500),
    []
  );

  const convertRow = (data: {
    id: number;
    average_rating: number;
    user: { username: string; id: number };
    description: string;
    price: number;
    category: { name: string };
    area: [{ id: number; name: string }];
    slot: [{ id: number; slot: string }];
  }) => ({
    id: data.id,
    rating: data.average_rating,
    servicedescription: data.description,
    price: data.price,
    serviceprovider: data.user.username,
    sp_id: data.user.id,
    servicecategory: data.category.name,
    areas: data.area.map((area) => ({
      id: area.id,
      name: area.name,
    })),
    slots: data.slot.map((slot) => ({ id: slot.id, name: slot.slot })),
  });

  useEffect(() => {
    debouncedSearch(currentPage, inputValue);
  }, [currentPage, inputValue, debouncedSearch]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setCurrentPage(1);
    debouncedSearch(1, value);
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

  const handleUpdate = (data: {
    service: number;
    slot: [{ id: number; name: string }];
    area: [{ id: number; name: string }];
    work_date: string;
  }) => {
    navigate("/book-appointment", { state: data });
  };

  const handleShowReview = (data: { id: number }) => {
    navigate("/reviews", { state: data });
  };

  return (
    <div>
      <div className="text-center fs-3 mt-3 " style={{ fontWeight: "bold" }}>
        Services
      </div>

      <div className="mb-4 mt-3">
        <SerachBox
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search services..."
          className="form-control"
          name={"serach"}
        />
      </div>
      {loader ? (
        <React.Fragment>
          {allServices.map(
            (item: {
              id: number;
              rating: number;
              servicedescription: string;
              price: number;
              serviceprovider: string;
              sp_id: number;
              servicecategory: string;
              areas: [{ id: number; name: string }];
              slots: [{ id: number; name: string }];
            }) => (
              <div key={item.id} className="service-card">
                <div className="header">{item.servicedescription}</div>
                <div className="row">
                  <div className="col-md-6">
                    <strong>Rating:</strong>
                  </div>
                  <div className="col-md-6">
                    <Rating value={item.rating ? 0 : item.rating} readOnly />
                  </div>
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
            )
          )}
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
        </React.Fragment>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "15% auto",
          }}
        >
          {" "}
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ShowServices;

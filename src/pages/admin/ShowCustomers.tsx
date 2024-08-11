import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { profileT } from "./ServiceProviders";
import Spinner from "../spiner";
import SerachBox from "../../components/common/FormController/SerachBox";
import { toast } from "react-toastify";
import useAxois from "../../hooks/axois";

const ShowCustomers = () => {
  const [customer, setCustomer] = useState<profileT[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { axoisGet } = useAxois();
  const [loader, setLoader] = useState<boolean>(false);

  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce(async (page, query) => {
      try {
        setLoader(false);
        const response = await axoisGet("userdata/", {
          type: "customer",
          page,
          search: query,
        });
        setCustomer(response.context?.results);
        setTotalPage(Math.ceil(response.context.count / 6));
        setLoader(true);
      } catch (error) {
        toast.error((error as Error).message);
      } finally {
        setLoader(true);
      }
    }, 1000),
    []
  );
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setCurrentPage(1);
    debouncedSearch(currentPage, value);
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

  const handleClick = (id: number) => {
    navigate("/status", {
      state: { id: id },
    });
  };
  return (
    <div className="add-form row">
      <div className="text-center fs-3 mt-3 " style={{ fontWeight: "bold" }}>
        Customers
      </div>
      <div className="mb-4 mt-3">
        <SerachBox
          name="search"
          value={inputValue}
          className="form-control"
          onChange={handleInputChange}
          placeholder="serach here"
        />
      </div>
      {loader ? (
        <React.Fragment>
          {customer.length == 0 ? (
            <div className="text-center text-danger">
              no data available yet!
            </div>
          ) : (
            <React.Fragment>
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
                                <i className="fa fa-envelope"></i> Show Bookings
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
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "16% auto",
          }}
        >
          {" "}
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ShowCustomers;

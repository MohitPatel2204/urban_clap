import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import Spinner from "../spiner";
import SerachBox from "../../components/common/FormController/SerachBox";
import useAxois from "../../hooks/axois";
import { toast } from "react-toastify";
import Toast from "../../components/common/Toast";

export interface profileT {
  pk: number;
  username: string;
  profile: [{ profile_photo: string }];
}

const ServiceProviders = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [sp, setSp] = useState<profileT[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const navigate = useNavigate();
  const { axoisGet } = useAxois();

  const debouncedSearch = useCallback(
    debounce(async (page: number, query: string) => {
      try {
        setLoader(false);
        const response = await axoisGet("userdata/", {
          type: "sp",
          page,
          search: query,
        });
        setSp(response.context?.results);
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
  }, [currentPage, debouncedSearch, inputValue]);

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
    navigate("/services", {
      state: { id: id },
    });
  };

  return (
    <div className="add-form row">
      <div className="text-center fs-3 mt-3 " style={{ fontWeight: "bold" }}>
        Service Providers
      </div>
      <div className="mb-4 mt-3">
        <SerachBox
          name="search"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      {loader ? (
        <React.Fragment>
          {sp.length == 0 ? (
            <div className="text-center text-danger">
              no data available yet!
            </div>
          ) : (
            <React.Fragment>
              {sp?.map((single, key) => (
                <div
                  className="container bootstrap snippets bootdey col-md-4 "
                  style={{ margin: "2% auto" }}
                  key={key}
                >
                  <div className="col-md-12 shadow-lg p-3 mb-5 bg-white rounded box-info text-center user-profile-2">
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
        <Spinner />
      )}
      <Toast />
    </div>
  );
};

export default ServiceProviders;

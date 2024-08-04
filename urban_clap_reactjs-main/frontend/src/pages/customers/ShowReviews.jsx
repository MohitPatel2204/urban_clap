import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/sidebar/Sidebar";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import { useLocation, useNavigate } from "react-router-dom";
import { getData } from "../../services/axiosrequests";
import { useSelector } from "react-redux";

const ShowReviews = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let userReduxData = useSelector((state) => state.user?.text);
  const [review, setReview] = useState([]);
  const fetchData = async () => {
    try {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const response = await getData(
        `${import.meta.env.VITE_API_URL}readreview/?serviceid=${
          location.state.id
        }`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setReview(response.context.data);
    } catch (error) {
      console.log(error);
      setReview("");
    }
  };

  const handleAddReview = (data) => {
    navigate("/addreview", {
      state: data,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          <div className="text-center fs-3 mt-3 text-primary">Reviews</div>
          <div
            className="col-md-2 btn btn-primary"
            onClick={() =>
              handleAddReview({
                service: location.state.id,
              })
            }
          >
            Add Review
          </div>
          <div className="row">
            {review.length == 0 ? (
              <div className="text-danger fs-1 text-center mt-5">
                No Data Found
              </div>
            ) : (
              review?.map((single) =>
                userReduxData.pk != single.user.id ? (
                  <div className="row border p-2 mb-3 ">
                    <>{console.log(single.user.id, userReduxData.pk)}</>
                    <div className="col-md-12 ">
                      User : {single.user.username}
                    </div>
                    <div className="col-md-12">rating : {single.rating}</div>
                    <div className="col-md-12">comment : {single.comment}</div>
                    {single?.images.map((img) => (
                      <div className="col-md-7">
                        <img
                          src={img.media}
                          width={"100%"}
                          alt={"Image Not Found"}
                        ></img>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="row border p-2 mb-3 ">
                    <div className="col-md-12 d-flex justify-content-end ">
                      User : {single.user.username}
                    </div>
                    <div className="col-md-12 d-flex justify-content-end">
                      rating : {single.rating}
                    </div>
                    <div className="col-md-12 d-flex justify-content-end">
                      comment : {single.comment}
                    </div>
                    {single?.images.map((img) => (
                      <div className="col-md-12 d-flex justify-content-end">
                        <img
                          // className="d-flex justify-content-end"
                          src={img.media}
                          width={"60%"}
                          alt={"Image Not Found"}
                        ></img>
                      </div>
                    ))}
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowReviews;
// d-flex justify-content-end

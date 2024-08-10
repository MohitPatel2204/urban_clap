import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getData } from "../../services/axiosrequests";
import { useSelector } from "react-redux";
import { Rating } from "@mui/material";
import userT from "../../types/userT";

const ShowReviews = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let userReduxData = useSelector(
    (state: { user: { text: userT } }) => state.user?.text
  );
  const [review, setReview] = useState([]);
  const fetchData = async () => {
    try {
      let storedata = JSON.parse(localStorage.getItem("creads") || "''");
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
      // setReview("");
    }
  };

  const handleAddReview = (data: { service: number }) => {
    navigate("/addreview", {
      state: data,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="fs-4 text-center mb-3 mt-2">Reviews</div>
      <div
        className="col-md-2 button mb-2"
        style={{ width: "130px" }}
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
          <div className="text-danger fs-1 text-center mt-5">No Data Found</div>
        ) : (
          review?.map(
            (single: {
              user: { username: string; id: string };
              rating: number;
              comment: string;
              images: [{ media: string }];
            }) =>
              (userReduxData.pk as any) != single.user.id ? (
                <div className="row border p-2 mb-3 ">
                  <div className="col-md-12 mb-1">
                    User : {single.user.username}
                  </div>
                  <div className="col-md-12 mb-1">
                    rating :{" "}
                    <Rating name="read-only" value={single.rating} readOnly />{" "}
                  </div>
                  <div className="col-md-12 mb-1">
                    comment : {single.comment}
                  </div>
                  {single?.images.map((img) => (
                    <div className="col-md-7 mb-1">
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
                  <div className="col-md-12 d-flex mb-1 justify-content-end ">
                    User : {single.user.username}
                  </div>
                  <div className="col-md-12 d-flex mb-1 justify-content-end">
                    <Rating name="read-only" value={single.rating} readOnly />{" "}
                  </div>
                  <div className="col-md-12 d-flex mb-1 justify-content-end">
                    comment : {single.comment}
                  </div>
                  {single?.images.map((img) => (
                    <div className="col-md-12 d-flex mb-1 justify-content-end">
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
  );
};

export default ShowReviews;
// d-flex justify-content-end

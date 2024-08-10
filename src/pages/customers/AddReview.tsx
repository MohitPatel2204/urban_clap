import  { useState } from "react";

import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "../../components/common/FormController/TextField";
import { postData } from "../../services/axiosrequests";
// import { validationSchemaAddReview } from "../../Schema/addreview";
import Swal from "sweetalert2";
import { Box, Rating, Typography } from "@mui/material";
import { validationSchemaAddReview } from "../../Schema/addreview";

const initalValues = {
  rating: "",
  comment: "",
  uploaded_images: [],
};
const AddReview = () => {
  const [value, setValue] = useState(0 as any);
  const location = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async (
    values: { uploaded_images: []; comment: string; rating: any },
    actions: any
  ) => {
    let storedata = JSON.parse(localStorage.getItem("creads") || "''");
    let config = {
      headers: {
        "Content-Type": " multipart/form-data",
        Authorization: `Bearer ${storedata.access}`,
      },
    };

    try {
      const formData = new FormData();
      values.uploaded_images.forEach((file) => {
        formData.append("uploaded_images", file);
      });
      formData.append("comment", values.comment);
      formData.append("rating", values.rating);
      formData.append("service", location.state?.service);

      const response = await postData(
        `${import.meta.env.VITE_API_URL}review/`,
        formData,
        config
      ).catch((err) => {
        console.log(err);
        actions.setErrors(err.response.data.context.data);
        actions.setSubmitting(false);
      });
      if (response.status == "success") {
        Swal.fire({
          title: "success",
          text: "Review Added..",
          icon: "success",
        }).then(() => {
          navigate("/reviews", {
            state: { id: location.state?.service },
          });
        });
      }
    } catch (err: any) {
      actions.setErrors(err.response.data.context.data);
      actions.setSubmitting(false);
    }
  };
  return (
    <div>
      <div className="fs-4 text-center mb-5">Add Review</div>
      <Formik
        initialValues={initalValues as any}
        validationSchema={validationSchemaAddReview}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <TextField
              type="text"
              name="comment"
              label="Comment"
              placeholder="Enter Reviw Here"
            />
            <label>Add Images</label>
            <input
              name="uploaded_images"
              type="file"
              className="form-control"
              multiple={true}
              onChange={(e: any) => {
                let files = Array.from(e.target.files);
                setFieldValue("uploaded_images", files);
              }}
            />

            <Box
              sx={{
                "& > legend": { mt: 0 },
              }}
            ></Box>
            <div className="col-md-12 mt-2">
              <Typography component="legend">No rating given</Typography>
              <Rating
                name="rating"
                value={value}
                onChange={(event: any, newValue) => {
                  setValue(newValue);
                  setFieldValue("rating", event.target.value);
                }}
              />
            </div>
            <button
              type="submit"
              className="button mt-3 "
              disabled={isSubmitting}
            >
              Submit Review
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddReview;

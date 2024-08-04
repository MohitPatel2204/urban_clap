import React, { useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import { Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "../../components/common/FormController/TextField";
import { postData } from "../../services/axiosrequests";
import { validationSchemaAddReview } from "../../Schema/addreview";
import Swal from "sweetalert2";

const initalValues = {
  rating: "",
  comment: "",
  uploaded_images: [],
};
const AddReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSubmit = async (values, actions) => {
    let storedata = JSON.parse(localStorage.getItem("creads"));
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
    } catch (err) {
      actions.setErrors(err.response.data.context.data);
      actions.setSubmitting(false);
    }
  };
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          <div className="text-center fs-3 text-primary mt-1">Add Review</div>
          <Formik
            initialValues={initalValues}
            validationSchema={validationSchemaAddReview}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setValues, setFieldValue, values }) => (
              <Form>
                <TextField
                  type="text"
                  name="comment"
                  label="Comment"
                  placeholder="Enter Reviw Here"
                />

                <input
                  name="uploaded_images"
                  type="file"
                  className="form-control"
                  multiple={true}
                  onChange={(e) => {
                    let files = Array.from(e.target.files);
                    setFieldValue("uploaded_images", files);
                  }}
                />
                <TextField
                  type="text"
                  name="rating"
                  label="Rating Stars"
                  placeholder="Enter Rating In Digit "
                />
                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={isSubmitting}
                >
                  Submit Review
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddReview;

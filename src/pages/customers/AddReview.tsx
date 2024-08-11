import { useState } from "react";

import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "../../components/common/FormController/TextField";
import Swal from "sweetalert2";
import { Box, Rating, Typography } from "@mui/material";
import { validationSchemaAddReview } from "../../Schema/addreview";
import { errorT } from "../../types/errorT";
import useAxois from "../../hooks/axois";

const initalValues = {
  rating: 0,
  comment: "",
  uploaded_images: [],
};

export type reviewT = {
  rating: number;
  comment: string;
  uploaded_images: Array<Blob>;
};

const AddReview = () => {
  const [value, setValue] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { axiosPost } = useAxois();
  const handleSubmit = async (
    values: reviewT,
    actions: FormikHelpers<reviewT>
  ) => {
    try {
      const formData = new FormData();
      values.uploaded_images.forEach((file) => {
        formData.append("uploaded_images", file);
      });
      formData.append("comment", values.comment);
      formData.append("rating", values.rating.toLocaleString());
      formData.append("service", location.state?.service);
      const response = await axiosPost(
        `review/`,
        formData as unknown as Record<string, unknown>,
        true
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
    } catch (err: unknown) {
      actions.setErrors(
        ((err as errorT).response.data.context as { data: unknown })
          .data as FormikErrors<reviewT>
      );
      actions.setSubmitting(false);
    }
  };
  return (
    <div>
      <div className="fs-4 text-center mb-5">Add Review</div>
      <Formik
        initialValues={initalValues as reviewT}
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
              onChange={(e) => {
                const files = Array.from(
                  e.target.files as unknown as Array<FileList>
                );
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
                onChange={(event, newValue) => {
                  setValue(newValue as number);
                  setFieldValue(
                    "rating",
                    (event as unknown as React.ChangeEvent<HTMLInputElement>)
                      .target.value
                  );
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

import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
// import { TextField } from "@mui/material";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../components/common/FormController/TextField";
import { validationschemaUpdateProfile } from "../../Schema/updateprofile";
import { putData } from "../../services/axiosrequests";
import Swal from "sweetalert2";
import { updateUser } from "../../Reducer/profile";
import { useNavigate } from "react-router-dom";

const Profiles = () => {
  let userReduxData = useSelector((state) => state.user);
  let [imageUrl, setImageUrl] = useState("");
  let userdata = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitData = async (values, actions) => {
    console.log("first", values);

    try {
      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("pk", values.pk);
      formData.append("last_name", values.last_name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("address", values.address);
      if (values.profile && values.profile.profile_photo) {
        formData.append("profile.profile_photo", values.profile.profile_photo);
      }
      let storedata = JSON.parse(localStorage.getItem("creads"));
      let config = {
        headers: {
          "Content-Type": " multipart/form-data",
          Authorization: `Bearer ${storedata.access}`,
        },
      };
      const response = await putData(
        `${import.meta.env.VITE_API_URL}updateuser/`,
        formData,
        config
      );

      dispatch(updateUser(response?.context?.profile[0]?.profile_photo));
      actions.setSubmitting(false);
      if (response.status == "success") {
        Swal.fire({
          title: "success",
          text: "profile updated..",
          icon: "success",
        }).then(() => {
          navigate("/profile");
        });
      }
    } catch (err) {
      if (Object.keys(err.response.data.context)) {
        actions.setErrors(err.response.data.context);
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page">
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "21%", width: "75%" }}>
          <Formik
            initialValues={userReduxData?.text}
            validationSchema={validationschemaUpdateProfile}
            onSubmit={submitData}
            enableReinitialize
          >
            {(formik) => (
              <Form className="form p-3">
                <div
                  className="row shadow-lg p-1  bg-white rounded"
                  style={{ marginLeft: "10%" }}
                >
                  <div className="col-md-5">
                    <img
                      src={
                        imageUrl == ""
                          ? formik.values?.profile.profile_photo
                          : imageUrl
                      }
                      alt="Image not found"
                      height={"250px"}
                      id="image"
                      className="mb-4"
                    ></img>
                    <TextField
                      style={{ width: "29%", marginLeft: "37%" }}
                      type="file"
                      label=""
                      name="profile_photo"
                      // values={formik.values?.profile.profile_photo}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "profile.profile_photo",
                          e.currentTarget.files[0]
                        );
                        setImageUrl(
                          URL.createObjectURL(e.currentTarget.files[0])
                        );
                      }}
                    />
                  </div>
                  <div className="col-md-7">
                    <div className="fs-5 text-primary">
                      User Profiles
                      <div className="row mb-4 mt-2">
                        <div className="col-9 mb-3">
                          <TextField
                            type="text"
                            label="Firstname"
                            name="first_name"
                            placeholder="Lorem"
                          />
                        </div>
                        <div className="col-9  mb-3">
                          <TextField
                            type="text"
                            name="last_name"
                            label="Lastname"
                            placeholder="Ipsum"
                          />
                        </div>
                        <div className="col-9  mb-3">
                          <TextField
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="loremipsum@gmail.com"
                          />
                        </div>
                        <div className="col-9  mb-3">
                          <TextField
                            type="text"
                            name="username"
                            label="Username"
                            placeholder="yashvahhani"
                          />
                        </div>
                        <div className="col-9  mb-3">
                          <TextField
                            type="text"
                            name="contact"
                            label="Contect"
                            placeholder="loremipsum@gmail.com"
                          />
                        </div>
                        <div className="col-9  mb-3">
                          <TextField
                            type="text"
                            name="address"
                            label="Address"
                            placeholder="Bhavanagar...."
                          />
                        </div>
                        <div className="col-4  mb-3">
                          <button type="submit" className="btn btn-primary">
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Profiles;

import React, { useState } from "react";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import { useDispatch, useSelector } from "react-redux";
import TextField from "../../components/common/FormController/TextField";
import Swal from "sweetalert2";
import { updateUser } from "../../reducer/profile";
import { useNavigate } from "react-router-dom";
import userT from "../../types/userT";
import { validationschemaUpdateProfile } from "../../Schema/updateprofile";
import { errorT } from "../../types/errorT";
import useAxois from "../../hooks/axois";

const Profiles = () => {
  const userReduxData = useSelector(
    (state: { user: { text: userT } }) => state.user
  );
  const [imageUrl, setImageUrl] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { axiosPut } = useAxois();
  const submitData = async (values: userT, actions: FormikHelpers<userT>) => {
    try {
      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("pk", values.pk as unknown as string);
      formData.append("last_name", values.last_name);
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("contact", values.contact);
      formData.append("address", values.address);
      if (values.profile.profile_photo) {
        formData.append("profile.profile_photo", values.profile.profile_photo);
      }
      const response = await axiosPut(
        `updateuser/`,
        formData as unknown as Record<string, unknown>,
        true
      );

      dispatch(updateUser(response?.context?.profile[0]?.profile_photo));
      if (response.status == "success") {
        Swal.fire({
          title: "success",
          text: "profile updated..",
          icon: "success",
        }).then(() => {
          navigate("/profile");
        });
      }
    } catch (err: unknown) {
      if ((err as errorT).response.data.context) {
        actions.setErrors(
          (err as errorT).response.data.context as FormikErrors<userT>
        );
      }
    }
  };

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={userReduxData?.text}
        validationSchema={validationschemaUpdateProfile}
        onSubmit={submitData}
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
                  onChange={(e: unknown) => {
                    formik.setFieldValue(
                      "profile.profile_photo",
                      (
                        (e as React.ChangeEvent<HTMLInputElement>).currentTarget
                          .files as FileList
                      )[0]
                    );
                    setImageUrl(
                      URL.createObjectURL(
                        (
                          (e as React.ChangeEvent<HTMLInputElement>)
                            .currentTarget.files as FileList
                        )[0]
                      )
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
                    <div className="col-4">
                      <button type="submit" className="button">
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
  );
};

export default Profiles;

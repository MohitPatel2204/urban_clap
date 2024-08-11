import "bootstrap/dist/css/bootstrap.css";
import { Formik, Form, FormikHelpers, FormikErrors } from "formik";
import TextField from "../../../components/common/FormController/TextField";
import "./resetpassword.css";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { resetPasswordSchema } from "../../../Schema/resetpassword";
import { errorT } from "../../../types/errorT";
import useAxois from "../../../hooks/axois";

const Resetpassword = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const uid = query.get("uid");
  const token = query.get("token");
  const { axiosPost } = useAxois();

  const handleSubmit = async (
    values: { new_password: string; confrim_password: string },
    actions: FormikHelpers<{ new_password: string; confrim_password: string }>
  ) => {
    try {
      const response = await axiosPost(
        "password_reset_confrim/",
        {
          u_id: uid,
          token: token,
          new_password: values.new_password,
        },
        false
      );
      actions.resetForm();
      setMessage(response.context.message);
    } catch (err: unknown) {
      console.log(err);
      if (Object.keys((err as errorT).response.data.context)) {
        actions.setErrors(
          (err as errorT).response.data.context as FormikErrors<{
            new_password: string;
            confrim_password: string;
          }>
        );
      }
      setMessage("");
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="resetpassword">
      <div className="resetpassword-form">
        <Formik
          initialValues={initialValues}
          validationSchema={resetPasswordSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <div className="row form-main-container">
              <div className="col-md-6 text-center">
                <div className="col-md-12">
                  <img
                    className="rounded-top rounded-bottom"
                    src={`./assets/images/forgot.gif`}
                    width={"650dvh"}
                  />
                </div>
              </div>
              <div className="col-md-4 mt-5">
                <div className="col-md-12">
                  <span
                    style={{ display: "none" }}
                    className="alert alert-danger text-center"
                    id="error"
                  >
                    invalid credentials
                  </span>
                </div>
                <p className="text-center text-blue fs-2 mb-5">
                  Change Password{" "}
                </p>
                <Form>
                  <TextField
                    type="text"
                    name="new_password"
                    label="New Password"
                    placeholder="Please Enter New password"
                  />
                  <TextField
                    type="text"
                    name="confrim_password"
                    label="Confrim Password"
                    placeholder="Please Enter Confrim password"
                  />

                  <p className="text-center">
                    <button
                      className="col-md-5 m-3 blue p-1 mt-5 rounded-pill"
                      type="submit"
                    >
                      Set Password
                    </button>
                  </p>

                  {message && (
                    <div className="col-11 m-3 text-center">
                      Go To signin Page{" "}
                      <Link
                        to="/signin"
                        className="link-offset-2 link-underline link-underline-opacity-0"
                        type="reset"
                      >
                        Signin
                      </Link>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

const initialValues = {
  new_password: "",
  confrim_password: "",
};

export default Resetpassword;

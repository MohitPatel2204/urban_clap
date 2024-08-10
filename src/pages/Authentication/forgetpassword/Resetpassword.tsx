import "bootstrap/dist/css/bootstrap.css";
import { Formik, Form } from "formik";
import TextField from "../../../components/common/FormController/TextField";
// import "../login/Login.css";
import "./resetpassword.css";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { postData } from "../../../services/axiosrequests";
import { resetPasswordSchema } from "../../../Schema/resetpassword";

const Resetpassword = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const uid = query.get("uid");
  const token = query.get("token");

  const handleSubmit = async (
    values: { new_password: string; confrim_password: string },
    actions: any
  ) => {
    try {
      const response = await postData(
        `${import.meta.env.VITE_API_URL}password_reset_confrim/`,
        { u_id: uid, token: token, new_password: values.new_password }
      );
      setMessage(response.context.message);
    } catch (err: any) {
      console.log(err);
      if (Object.keys(err.response.data.context)) {
        actions.setErrors(err.response.data.context);
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
                    // src={logo}
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

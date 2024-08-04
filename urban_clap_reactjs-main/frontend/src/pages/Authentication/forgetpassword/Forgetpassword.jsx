import { Form, Formik } from "formik";
import React, { useState } from "react";
import TextField from "../../../components/common/FormController/TextField";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import "./forgetpass.css";
import { forgotPasswordSchema } from "../../../Schema/forgot";
import { postData } from "../../../services/axiosrequests";

const Forgetpassword = () => {
  const [resetLink, setResetLink] = useState(false);
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (values, actions) => {
    try {
      const response = await postData(
        `${import.meta.env.VITE_API_URL}forgot-password/`,
        values
      );

      setUid(response.context.u_id);
      setToken(response.context.token);
      setResetLink(true);
    } catch (err) {
      if (Object.keys(err.response.data.context)) {
        actions.setErrors(err.response.data.context);
      }
      setResetLink(false);
    }
    actions.setSubmitting(false);
  };

  return (
    <div className="forget-containere">
      <div className="form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <div className="row form-main-container">
              <div className="col-md-5">
                <p className="fs-3 ">Forgot your password?</p>
                <p className="fs-6 mb-5">
                  Please enter the email you use to sign in to urbanclap
                </p>
                <Form>
                  <TextField
                    type="text"
                    name="username"
                    label="Username"
                    placeholder="Please enter your username"
                  />

                  <p className="text-center">
                    <button
                      className="col-md-5 m-3 blue p-1 mt-5 rounded-pill"
                      type="submit"
                    >
                      Rest Password
                    </button>
                  </p>
                  <div className="col-11 m-3 text-center">
                    Back to?{" "}
                    <Link
                      to="/signin"
                      className="link-offset-2 link-underline link-underline-opacity-0"
                      type="reset"
                    >
                      Sign In
                    </Link>
                  </div>
                </Form>
                {resetLink && (
                  <div>
                    <p>Reset Your Password Using the Following Link :</p>
                    <Link
                      className="link-offset-2 link-underline link-underline-opacity-0 text-center"
                      to={`/reset_password?uid=${uid}&token=${token}`}
                    >
                      Go To Reset Password
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

const initialValues = {
  username: "",
};

export default Forgetpassword;

import "bootstrap/dist/css/bootstrap.css";
import { Formik, Form } from "formik";
import TextField from "../../../components/common/FormController/TextField";
import "./Login.css";
import { Link, json, useNavigate } from "react-router-dom";
import React from "react";
import { logiValidationSchema } from "../../../Schema/login";
import { postData } from "../../../services/axiosrequests";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values, actions) => {
    const errorTag = document.getElementById("error");
    try {
      const response = await postData(
        `${import.meta.env.VITE_API_URL}login/`,
        values
      );
      errorTag.style.display = "none";
      localStorage.setItem("creads", JSON.stringify(response.context));
      if (response.context.is_staff) {
        navigate("/dashboard");
      } else if (response.context.is_superuser) {
        navigate("/dashboard");
      } else {
        navigate("/all-services");
      }
    } catch (err) {
      if (Object.keys(err.response.data.context)) {
        errorTag.style.display = "block";
      }
    }
  };

  return (
    <div className="login">
      {/* <div className="container-app">
        <PropagateLoader />
      </div> */}
      <div className="login-form">
        <Formik
          initialValues={initialValues}
          validationSchema={logiValidationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <div className="row form-main-container">
              <div className="col-md-6 text-center mt-4">
                <div className="col-md-12">
                  <img
                    className="rounded-top rounded-bottom"
                    src={`./assets/images/login.gif`}
                    // src={logo}
                    width={"650dvh"}
                  />
                </div>
              </div>
              <div className="col-md-4">
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
                  Welcome to Urbanclap Login{" "}
                </p>
                <Form>
                  <TextField
                    type="text"
                    name="username"
                    label="Username"
                    placeholder="Please Enter Your Username"
                  />
                  <TextField
                    type="text"
                    name="password"
                    label="Password"
                    placeholder="qwert@123"
                  />
                  <p className="text-end">
                    <Link
                      to="/forget-password"
                      className="link-offset-2 link-underline link-underline-opacity-0"
                    >
                      Forget Password?
                    </Link>
                  </p>
                  <p className="text-center">
                    <button
                      className="col-md-5 m-3 blue p-1 mt-5 rounded-pill"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </p>
                  <div className="col-11 m-3 text-center">
                    New Member?{" "}
                    <Link
                      to="/signup"
                      className="link-offset-2 link-underline link-underline-opacity-0"
                      type="reset"
                    >
                      Create Account
                    </Link>
                  </div>
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
  username: "",
  password: "",
};

export default Login;

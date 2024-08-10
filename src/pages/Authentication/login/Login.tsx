import { Formik, Form } from "formik";
import "./Login.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/UseAuth";
import { postData } from "../../../services/axiosrequests";
import TextField from "../../../components/common/FormController/TextField";
import { logiValidationSchema } from "../../../Schema/login";

const Login = () => {
  const { login } = useAuth();
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    const errorTag = document.getElementById("error") as HTMLElement;
    try {
      const response = await postData(
        `${import.meta.env.VITE_API_URL}login/`,
        values
      );
      errorTag.style.display = "none";
      await login(response.context);
    } catch (err: any) {
      if (Object.keys(err.response.data.context)) {
        errorTag.style.display = "block";
      }
    }
  };

  return (
    <div className="login">
      <div className="login-form">
        <Formik
          initialValues={initialValues}
          validationSchema={logiValidationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
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

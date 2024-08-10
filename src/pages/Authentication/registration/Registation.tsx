import React, { useState } from "react";
import "./Registration.css";
import { Formik, Form } from "formik";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Firststep from "./Firststep";
import SecondStep from "./SecondStep";
// import { validationschema } from "../../../Schema/registration";
import { postData } from "../../../services/axiosrequests";
import { validationschema } from "../../../Schema/registration";
import userT from "../../../types/userT";

const steps = ["Step1", "step2"];
function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const isLastStep = () => currentStep === steps.length - 1;

  const submitData = async (values: userT, actions: any) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("password", values.password as string);
    formData.append("password2", values.password2 as string);
    formData.append("contact", values.contact);
    formData.append("address", values.address);
    formData.append("is_staff", values.is_staff as any);
    if (values.profile && values.profile.profile_photo) {
      formData.append("profile.profile_photo", values.profile.profile_photo);
    }

    if (isLastStep()) {
      try {
        const response = await postData(
          `${import.meta.env.VITE_API_URL}customuser/`,
          formData,
          { headers: { "Content-Type": " multipart/form-data" } }
        );
        navigate("/signin");
      } catch (err: any) {
        if (Object.keys(err.response.data.context)) {
          actions.setErrors(err.response.data.context);
        }
      }
    } else {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="div text-center alert alert-danger"
        id="error"
        style={{ display: "none" }}
      ></div>
      <div className="registration-form ">
        <div className="div">
          <div className="col-12">
            <h1 className="text-center text-blue">Signup</h1>
          </div>
          <div className="col-6">
            <img src="./assets/images/registration.gif" width={"650dvh"} />
          </div>
        </div>
        <div className="row mt-5">
          <Formik
            initialValues={initialValues}
            validationSchema={validationschema[currentStep]}
            onSubmit={submitData}
          >
            {(formik) => (
              // <div className="row ">
              <Form className="form p-3">
                {currentStep == 0 && <Firststep formik={formik} />}
                {currentStep == 1 && <SecondStep formik={formik} />}

                <div className="row">
                  {currentStep > 0 && (
                    <button
                      className="col-md-11 m-3 blue p-1"
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Back
                    </button>
                  )}
                  <button className="col-md-11 m-3 blue p-1" type="submit">
                    {isLastStep() ? "Create New Account" : "Next"}
                  </button>
                  <div className="col-11 m-3 text-center">
                    Have an account?{" "}
                    <Link
                      to="/signin"
                      className="link-offset-2 link-underline link-underline-opacity-0"
                      type="reset"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </Form>
              // </div>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

const initialValues: userT = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  password2: "",
  address: "",
  username: "",
  contact: "",
  is_staff: false,
  profile: {
    profile_photo: "",
  },
};

export default Registration;

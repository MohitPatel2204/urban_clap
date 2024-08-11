import React, { useState } from "react";
import "./Registration.css";
import { Formik, Form, FormikHelpers, FormikErrors } from "formik";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Firststep from "./Firststep";
import SecondStep from "./SecondStep";
import { validationschema } from "../../../Schema/registration";
import userT from "../../../types/userT";
import { errorT } from "../../../types/errorT";
import useAxois from "../../../hooks/axois";
import { toast } from "react-toastify";
import Toast from "../../../components/common/Toast";

const steps = ["Step1", "step2"];
function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { axiosPost } = useAxois();

  const isLastStep = () => currentStep === steps.length - 1;

  const submitData = async (values: userT, actions: FormikHelpers<userT>) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("password", values.password as string);
    formData.append("password2", values.password2 as string);
    formData.append("contact", values.contact);
    formData.append("address", values.address);
    formData.append("is_staff", values.is_staff ? "true" : "false");
    if (values.profile.profile_photo) {
      formData.append("profile.profile_photo", values.profile.profile_photo);
    }

    if (isLastStep()) {
      try {
        await axiosPost(
          "customuser/",
          formData as unknown as Record<string, unknown>,
          true
        );
        toast.success("Register sucess...");
        navigate("/signin");
      } catch (err: unknown) {
        if (Object.keys((err as errorT).response.data.context)) {
          actions.setErrors(
            (err as errorT).response.data
              .context as unknown as FormikErrors<userT>
          );
        }
      }
    } else {
      setCurrentStep(currentStep + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Toast />
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
            )}
          </Formik>
        </div>
      </div>
    </React.Fragment>
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
    profile_photo: null,
  },
};

export default Registration;

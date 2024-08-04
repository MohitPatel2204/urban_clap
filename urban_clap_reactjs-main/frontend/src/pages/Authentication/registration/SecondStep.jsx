import React from "react";
import TextField from "../../../components/common/FormController/TextField";
import { ErrorMessage, Field } from "formik";

const SecondStep = ({ formik }) => {
  return (
    <>
      <TextField
        type="email"
        name="email"
        label="Email"
        placeholder="loremipsum@gmail.com"
      />
      <TextField
        type="text"
        name="username"
        label="Username"
        placeholder="yashvahhani"
      />
      <TextField
        type="text"
        name="password"
        label="Password"
        placeholder="qwert@123"
      />
      <div className="mb-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          className={`form-control shadow-none ${
            formik.touched.password2 && formik.errors.password2 && "is-invalid"
          }`}
          type="text"
          name="password2"
          placeholder="confirm password..."
          {...formik.getFieldProps("password2")}
        />
        <ErrorMessage component="div" name="password2" className="error" />
      </div>
      <label>
        Service Provider : <Field type="checkbox" name="is_staff" />
      </label>
    </>
  );
};

export default SecondStep;

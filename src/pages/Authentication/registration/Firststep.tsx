import React from "react";
import TextField from "../../../components/common/FormController/TextField";
import { FormikProps } from "formik";
import userT from "../../../types/userT";

const Firststep: React.FC<{ formik: FormikProps<userT> }> = ({ formik }) => {
  return (
    <React.Fragment>
      <TextField
        type="text"
        label="Firstname"
        name="first_name"
        placeholder="Lorem"
      />
      <TextField
        type="text"
        name="last_name"
        label="Lastname"
        placeholder="Ipsum"
      />
      <TextField
        type="text"
        name="contact"
        label="Contect"
        placeholder="0000000000"
      />
      <TextField
        type="text"
        name="address"
        label="Address"
        placeholder="Bhavanagar...."
      />
      <TextField
        type="file"
        name="profile_photo"
        label="Address"
        onChange={(e: unknown) => {
          formik.setFieldValue(
            "profile.profile_photo",
            ((e as React.ChangeEvent<HTMLInputElement>).currentTarget.files as unknown as FileList)[0]
          );
        }}
      />
    </React.Fragment>
  );
};

export default Firststep;

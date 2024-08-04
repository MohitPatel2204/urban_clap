import * as Yup from "yup";

export const validationschema = [
  Yup.object().shape({
    first_name: Yup.string().required("Firstname Required!"),
    last_name: Yup.string(),
    address: Yup.string().required("Address Required!"),
    contact: Yup.string()
      .required("Contact Required!")
      .matches(
        "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$",
        "Contact Number Invalid"
      ),
    profile: Yup.object().shape({
      profile_photo: Yup.mixed().required("Profile Photo is Requierd"),
    }),
  }),
  Yup.object().shape({
    email: Yup.string().email("Email is invalid!").required("Email Required!"),
    username: Yup.string().required("Username Required!"),
    password: Yup.string()
      .min(8, "Password must be minimum 8 digits!")
      .required("Password Required!"),
    password2: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password must match!")
      .required("Confirm password is reqired!"),
  }),
];

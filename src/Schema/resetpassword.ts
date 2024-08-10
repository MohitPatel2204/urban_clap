import * as Yup from "yup";

export const resetPasswordSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(8, "New Password must be minimum 8 digits!")
    .required("New Password Required!"),
  confrim_password: Yup.string()
    .oneOf([Yup.ref("new_password")], "Password must match!")
    .required("Confirm password is reqired!"),
});

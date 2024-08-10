import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object({
  username: Yup.string().required("Username Required!"),
});

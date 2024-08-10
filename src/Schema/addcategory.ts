import * as Yup from "yup";

export const logiValidationSchemaCategory = Yup.object({
  name: Yup.string().required("Slot Required"),
});

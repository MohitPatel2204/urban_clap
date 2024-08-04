import * as Yup from "yup";

export const validationSchemaAddAppointment = Yup.object().shape({
  area: Yup.number().required("Cetegory is required"),
  slot: Yup.number().required("Cetegory is required"),
  work_date: Yup.date(),
  service: Yup.number(),
});

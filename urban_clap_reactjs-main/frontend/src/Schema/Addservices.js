import * as Yup from "yup";

export const validationSchemaAddServices = Yup.object().shape({
  category: Yup.string().required("Cetegory is required"),
  area: Yup.array().min(1, "area at least one option"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be at most 200 characters"),
  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least $0.01")
    .max(9999.99, "Price must be less than $9999.99"),
  slot: Yup.array().min(1, "sloat at least one option"),
});

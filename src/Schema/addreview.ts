import * as Yup from "yup";

export const validationSchemaAddReview = Yup.object().shape({
  comment: Yup.string().required("Comment Required"),
  rating: Yup.number().required("Rating Required"),
  uploaded_images: Yup.array().min(1, "one image at least"),
});

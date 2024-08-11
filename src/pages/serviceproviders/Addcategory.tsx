import { useLocation, useNavigate } from "react-router-dom";
import TextField from "../../components/common/FormController/TextField";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import Swal from "sweetalert2";
import { logiValidationSchemaCategory } from "../../Schema/addcategory";
import { errorT } from "../../types/errorT";
import useAxois from "../../hooks/axois";

type categoryT = {
  name: string;
  id: string;
};

const Addcategory = () => {
  const location = useLocation();
  const initialValues = location.state;
  const navigate = useNavigate();
  const { axiosPost, axiosPatch } = useAxois();
  const handleSubmit = async (
    values: categoryT,
    actions: FormikHelpers<categoryT>
  ) => {
    if (values.id == undefined) {
      try {
        const response = await axiosPost("category/", values, false);
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Category Added..",
            icon: "success",
          }).then(() => {
            navigate("/category");
          });
        }
      } catch (err: unknown) {
        if (Object.keys((err as errorT).response.data.context)) {
          actions.setErrors(
            (err as errorT).response.data
              .context as unknown as FormikErrors<categoryT>
          );
        }
        actions.setSubmitting(false);
      }
    } else {
      try {
        const response = await axiosPatch(
          `category/?id=${values.id}`,
          values,
          false
        );
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Category Updated..",
            icon: "success",
          }).then(() => {
            navigate(-1);
          });
        }
      } catch (err) {
        if (Object.keys((err as errorT).response.data.context)) {
          actions.setErrors(
            (err as errorT).response.data.context as FormikErrors<categoryT>
          );
        }
        actions.setSubmitting(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center fs-3 mt-2" style={{ fontWeight: "bold" }}>
            Add Category Form
          </div>
          <div
            id="success"
            className="alert alert-success fs-6"
            style={{ display: "none" }}
          ></div>
          <Formik
            initialValues={initialValues}
            validationSchema={logiValidationSchemaCategory}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <TextField
                  type="text"
                  name="name"
                  label="Category Name"
                  placeholder="Please Enter Category Name"
                />
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="button mt-3"
                    disabled={isSubmitting}
                  >
                    {initialValues.id == undefined && "Submit"}
                    {initialValues.id != undefined && "update"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Addcategory;

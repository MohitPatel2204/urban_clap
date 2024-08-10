import { useLocation, useNavigate } from "react-router-dom";
import TextField from "../../components/common/FormController/TextField";
import { Form, Formik } from "formik";
import { patchData, postData } from "../../services/axiosrequests";
import Swal from "sweetalert2";
import { logiValidationSchemaCategory } from "../../Schema/addcategory";

const Addcategory = () => {
  const location = useLocation();
  const initialValues = location.state;
  const navigate = useNavigate();

  const handleSubmit = async (
    values: { name: string; id: number },
    actions: any
  ) => {
    let storedata = JSON.parse(localStorage.getItem("creads") || "''");
    let config = {
      headers: { Authorization: `Bearer ${storedata.access}` },
    };
    if (values.id == undefined) {
      try {
        const response = await postData(
          `${import.meta.env.VITE_API_URL}category/`,
          values,
          config
        );
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Category Added..",
            icon: "success",
          }).then(() => {
            navigate("/category");
          });
        }
      } catch (err: any) {
        console.log(err);
        if (Object.keys(err.response.data.context)) {
          actions.setErrors(err.response.data.context);
        }
        actions.setSubmitting(false);
      }
    } else {
      try {
        const response = await patchData(
          `${import.meta.env.VITE_API_URL}category/?id=${values.id}`,
          values,
          config
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
        // navigate("/category");
      } catch (err: any) {
        if (Object.keys(err.response.data.context)) {
          console.log("err");
          actions.setErrors(err.response.data.context);
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

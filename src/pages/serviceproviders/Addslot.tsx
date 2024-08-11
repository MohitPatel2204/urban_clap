import { useLocation, useNavigate } from "react-router-dom";
import { Form, Formik, FormikErrors, FormikHelpers } from "formik";
import TextField from "../../components/common/FormController/TextField";
import Swal from "sweetalert2";
import { ValidationSchemaSlot } from "../../Schema/addslot";
import { errorT } from "../../types/errorT";
import useAxois from "../../hooks/axois";

const Addslot = () => {
  const location = useLocation();
  const initialValues = location.state;
  const navigate = useNavigate();
  const { axiosPatch, axiosPost } = useAxois();

  const handleSubmit = async (
    values: { id: number; slot: number },
    actions: FormikHelpers<{ id: number; slot: number }>
  ) => {
    if (!values.id) {
      try {
        const response = await axiosPost(`slot/`, values, false);
        if (response.status === "success") {
          Swal.fire({
            title: "success",
            text: "Slot Added..",
            icon: "success",
          }).then(() => {
            navigate("/slot");
          });
        }
      } catch (err) {
        if (Object.keys((err as errorT).response.data.context)) {
          actions.setErrors(
            (err as errorT).response.data.context as FormikErrors<{
              id: number;
              slot: number;
            }>
          );
        }
        actions.setSubmitting(false);
      }
    } else {
      try {
        const response = await axiosPatch(`slot/${values.id}/`, values, false);
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Slot Updated ..",
            icon: "success",
          }).then(() => {
            navigate("/slot");
          });
        }
      } catch (err) {
        if (Object.keys((err as errorT).response.data.context)) {
          console.log("err");
          actions.setErrors(
            (err as errorT).response.data.context as FormikErrors<{
              id: number;
              slot: number;
            }>
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
            Add Slot Form
          </div>
          <div
            id="success"
            className="alert alert-success fs-6"
            style={{ display: "none" }}
          ></div>
          <Formik
            initialValues={initialValues}
            validationSchema={ValidationSchemaSlot}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <TextField
                  type="text"
                  name="slot"
                  label="Slot"
                  placeholder="10Am to 11 Am"
                />
                <div className="d-flex justify-content-center gap-3 mt-4">
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

export default Addslot;

import  { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SelectField from "../../components/common/FormController/SelectField";
import TextField from "../../components/common/FormController/TextField";
import { Form, Formik } from "formik";
import { postData } from "../../services/axiosrequests";
import Swal from "sweetalert2";
import { validationSchemaAddAppointment } from "../../Schema/addappointment";

const AddAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState<{
    area: [];
    slot: [];
    service: number;
    work_date: string;
  }>({} as { area: []; slot: []; service: number; work_date: string });
  useEffect(() => {
    setValue({
      service: location.state.service,
      slot: location.state.slot,
      area: location.state.area,
      work_date: location.state.work_date,
    });
  }, []);

  const handleSubmit = async (values: { area: []; slot: [] }, actions: any) => {
    let storedata = JSON.parse(localStorage.getItem("creads") || "''");
    let config = {
      headers: { Authorization: `Bearer ${storedata.access}` },
    };
    try {
      const response = await postData(
        `${import.meta.env.VITE_API_URL}appointment/`,
        values,
        config
      ).catch((err) => {
        actions.setErrors(err.response.data.context.data);
        actions.setSubmitting(false);
      });
      if (response.status == "success") {
        Swal.fire({
          title: "success",
          text: "Booked...",
          icon: "success",
        }).then(() => {
          navigate("/all-services");
        });
      }
    } catch (err: any) {
      actions.setErrors(err.response.data.context.data);
      actions.setSubmitting(false);
    }
  };
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="fs-4 text-center mb-5">Add Appointment</div>
          <div
            id="success"
            className="alert alert-success fs-6"
            style={{ display: "none" }}
          ></div>
          <Formik
            initialValues={{ ...value, service: location.state.service }}
            validationSchema={validationSchemaAddAppointment}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <SelectField
                  className="mb-2"
                  label="Area"
                  name="area"
                  options={value?.area}
                  multiple={false}
                />
                <SelectField
                  className="mb-2"
                  label="Slot"
                  name="slot"
                  options={value?.slot}
                  multiple={false}
                />
                <TextField
                  type="date"
                  name="work_date"
                  label="Work Date"
                  placeholder=""
                />

                <button
                  type="submit"
                  className="btn btn-primary mt-3"
                  disabled={isSubmitting}
                >
                  submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default AddAppointment;

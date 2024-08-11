import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers, FormikErrors } from "formik";
import TextField from "../../components/common/FormController/TextField";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SelectField from "../../components/common/FormController/SelectField";
import { validationSchemaAddServices } from "../../Schema/Addservices";
import { errorT } from "../../types/errorT";
import useAxois from "../../hooks/axois";

type serviceT = {
  category: number;
  description: string;
  area: number[];
  slot: number[];
  price: number;
  id: number;
};
type rowT = { id: number; slot?: string; name: string };

const Addservices = () => {
  const location = useLocation();
  const initialValues = location.state;
  const navigate = useNavigate();
  const [cetegory, setCategory] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [slot, setSlot] = useState<Array<{ id: string; name: string }>>([]);
  const { axiosPost, axoisGet, axiosPatch } = useAxois();
  const fetchData = async () => {
    try {
      const cetegoryOptions = await axoisGet(`allcategory/`);
      const response = await axoisGet(`allslot/`);
      setCategory(cetegoryOptions.context.data);
      const optionSlots = response.context.map((slot: rowT) =>
        convertrow(slot)
      );
      setSlot(optionSlots);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (
    values: serviceT,
    actions: FormikHelpers<serviceT>
  ) => {
    values.slot = values.slot.map((i: number) => Number(i));
    values.area = values.area.map((i: number) => Number(i));

    if (values.id == undefined) {
      try {
        const response = await axiosPost(`services/`, values, false);
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Service Added..",
            icon: "success",
          }).then(() => {
            navigate(-1);
          });
        }
      } catch (err) {
        if (Object.keys((err as errorT).response.data.context)) {
          actions.setErrors(
            (err as errorT).response.data.context as FormikErrors<serviceT>
          );
        }
        actions.setSubmitting(false);
      }
    } else {
      try {
        const response = await axiosPatch(
          `services/${values.id}/`,
          values,
          false
        );
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Service Updated..",
            icon: "success",
          }).then(() => {
            navigate(-1);
          });
        }
      } catch (err) {
        if (Object.keys((err as errorT).response.data.context)) {
          console.log("err");
          actions.setErrors(
            (err as errorT).response.data.context as FormikErrors<serviceT>
          );
        }
        actions.setSubmitting(false);
      }
    }
  };
  const convertrow = (data: rowT) => {
    return { id: data.id, name: data.slot };
  };

  const area = [
    { id: "1", name: "kaliyabid" },
    { id: "2", name: "ghoghacircle" },
  ];
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="text-center fs-3 mt-2" style={{ fontWeight: "bold" }}>
            Add Services Form
          </div>
          <div
            id="success"
            className="alert alert-success fs-6"
            style={{ display: "none" }}
          ></div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchemaAddServices}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <SelectField
                  className="mb-2"
                  label="Select a single option"
                  name="category"
                  options={cetegory}
                  multiple={false}
                />
                <TextField
                  type="text"
                  name="description"
                  label="Description"
                  placeholder="Please Enter Description"
                />
                <SelectField
                  className="mb-2"
                  label="Select multiple options"
                  name="area"
                  options={area}
                  multiple={true}
                />
                <SelectField
                  className="mb-2"
                  label="Select multiple options"
                  name="slot"
                  options={slot}
                  multiple={true}
                />
                <TextField
                  type="text"
                  name="price"
                  label="Price"
                  placeholder="Please Enter Description"
                />
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button
                    type="submit"
                    className="button mt-3"
                    disabled={isSubmitting}
                  >
                    {/* Submit */}
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

export default Addservices;

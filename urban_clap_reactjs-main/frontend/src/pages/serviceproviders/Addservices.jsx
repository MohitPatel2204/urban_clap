import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../layouts/header/ResponsiveAppBar";
import Sidebar from "../../layouts/sidebar/Sidebar";
import { Formik, Form } from "formik";
import SelectField from "../../components/common/FormController/SelectField";
import TextField from "../../components/common/FormController/TextField";
import { getData, patchData, postData } from "../../services/axiosrequests";
import { validationSchemaAddServices } from "../../Schema/Addservices";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Addservices = (props) => {
  const location = useLocation();
  const initialValues = location.state;
  const navigate = useNavigate();
  const [cetegory, setCategory] = useState([]);
  const [slot, setSlot] = useState([]);

  const fetchData = async () => {
    try {
      let storedata = JSON.parse(localStorage.getItem("creads"));
      const cetegoryOptions = await getData(
        `${import.meta.env.VITE_API_URL}allcategory/`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      const response = await getData(
        `${import.meta.env.VITE_API_URL}allslot/`,
        {
          headers: { Authorization: `Bearer ${storedata.access}` },
        }
      );
      setCategory(cetegoryOptions.context.data);
      const optionSlots = response.context.map((slot) => convertrow(slot));
      setSlot(optionSlots);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const initialValues = {
  //   category: "",
  //   area: [],
  //   description: "",
  //   price: "",
  //   slot: [],
  // };

  const handleSubmit = async (values, actions) => {
    values.slot = values.slot.map((i) => Number(i));
    values.area = values.area.map((i) => Number(i));

    let storedata = JSON.parse(localStorage.getItem("creads"));
    let config = {
      headers: { Authorization: `Bearer ${storedata.access}` },
    };
    if (values.id == undefined) {
      try {
        const response = await postData(
          `${import.meta.env.VITE_API_URL}services/`,
          values,
          config
        );
        if (response.status == "success") {
          Swal.fire({
            title: "success",
            text: "Service Added..",
            icon: "success",
          }).then(() => {
            navigate(-1);
          });
        }
        // navigate("/services");
      } catch (err) {
        if (Object.keys(err.response.data.context)) {
          actions.setErrors(err.response.data.context);
        }
        actions.setSubmitting(false);
      }
    } else {
      try {
        const response = await patchData(
          `${import.meta.env.VITE_API_URL}services/${values.id}/`,
          values,
          config
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
        if (Object.keys(err.response.data.context)) {
          console.log("err");
          actions.setErrors(err.response.data.context);
        }
        actions.setSubmitting(false);
      }
    }
  };
  const convertrow = (data) => {
    return { id: data.id, name: data.slot };
  };

  const area = [
    { id: "2", name: "kaliyabid" },
    { id: "3", name: "ghoghacircle" },
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="header-for-page" style={{ width: "100%" }}>
        <ResponsiveAppBar />
        <div className="add-form" style={{ marginLeft: "22%", width: "75%" }}>
          <div className="container mt-4">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="fs-4 text-center mb-5">Add Services Form</div>
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
                      {/* {console.log(optionSlots, "asjkhasjahskjdhaskjdhak")} */}
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

                      <button
                        type="submit"
                        className="btn btn-primary mt-3"
                        disabled={isSubmitting}
                      >
                        {/* Submit */}
                        {initialValues.id == undefined && "Submit"}
                        {initialValues.id != undefined && "update"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addservices;

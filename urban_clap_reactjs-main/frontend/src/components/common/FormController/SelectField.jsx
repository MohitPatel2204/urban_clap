import React from "react";
import { useField } from "formik";

const SelectField = ({ label, options, className, multiple, ...props }) => {
  const [field, meta, helpers] = useField(props);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map(
        (option) => option.value
      );
      helpers.setValue(selectedOptions);
    } else {
      helpers.setValue(selectedValue);
    }
  };

  const handleRemoveOption = (optionValue) => {
    const updatedValue = field.value.filter((value) => value !== optionValue);
    helpers.setValue(updatedValue);
  };

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={props.id || props.name}>{label}</label>
      <select
        id={props.id || props.name}
        multiple={multiple}
        className={`form-control ${
          meta.touched && meta.error ? "is-invalid" : ""
        }`}
        {...field}
        onChange={handleChange}
      >
        <option key="" value="">
          select value
        </option>
        {options?.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
      {/* {multiple && field.value.length > 0 && (
        <div className="mt-2">
          {field.value.map((selectedValue, index) => (
            <span key={index} className="badge badge-primary p-2 mr-2">
              {options?.find((option) => option.id === selectedValue)?.name}
              <button
                type="button"
                className="close ml-2"
                aria-label="Close"
                onClick={() => handleRemoveOption(selectedValue)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </span>
          ))}
        </div>
      )} */}
    </div>
  );
};
export default SelectField;

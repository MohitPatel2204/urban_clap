import React from "react";
import { ErrorMessage, FieldValidator, useField } from "formik";

export interface InputProps {
  label?: string;
  name: string;
  validate?: FieldValidator;
  type?: "text" | "date" | "number" | "file" | "email";
  value?: string;
  placeholder?: string;
  onChange?: (value: unknown) => unknown;
  className?: string;
  id?: string;
  style?: Record<string, string>;
  multiple?: boolean;
}

const TextField = ({ label, ...props }: InputProps) => {
  const [field, meta] = useField({
    name: props.name,
    validate: props?.validate,
  });

  return (
    <div className="mb-2">
      {label ? (
        <label htmlFor={field.name}>{label}</label>
      ) : (
        <React.Fragment></React.Fragment>
      )}
      <input
        type={props.type ?? "text"}
        placeholder={props.placeholder ?? ""}
        style={props.style || {}}
        className={`form-control shadow-none ${
          meta.touched && meta.error && "is-invalid"
        }`}
        multiple={
          props.multiple === true
            ? true
            : props.type === "file"
            ? false
            : undefined
        }
        {...field}
        onChange={(e) => {
          if (field) {
            field.onChange(e);
          }
          if (props.onChange) {
            if (props.type === "file" && e.target.files) {
              props.onChange(e);
            } else {
              props.onChange(e.target.value);
            }
          }
        }}
        autoComplete="off"
      />
      {meta.error && (
        <ErrorMessage component="div" name={field.name} className="error" />
      )}
    </div>
  );
};

export default TextField;

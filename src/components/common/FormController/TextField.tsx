import React from "react";
import { ErrorMessage, FieldValidator, useField } from "formik";

export interface InputProps {
  label: string;
  name: string;
  validate?: FieldValidator;
  type?: string;
  multiple?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: unknown;
  className?: string;
  options?: Array<{
    id: string;
    name: string;
  }>;
  id?: string;
  style?: Record<string, string>;
}

const TextField = ({ label, ...props }: InputProps) => {
  const [field, meta, helpers] = useField({
    name: props.name,
    validate: props.validate,
  });
  console.log("🚀 ~ file: TextField.tsx:28 ~ TextField ~ helpers:", helpers);
  return (
    <div className="mb-2">
      {label ? <label htmlFor={field.name}>{label}</label> : <></>}
      <input
        className={`form-control shadow-none ${
          meta.touched && meta.error && "is-invalid"
        }`}
        {...field}
        onChange={(e: React.chan)=>{
          field.onChange(e);

        }}
        autoComplete="off"
      />
      <ErrorMessage component="div" name={field.name} className="error" />
    </div>
  );
};

export default TextField;

import React from "react";

const SerachBox = ({
  name,
  placeholder,
  onChange,
  value,
  className,
  style,
}: {
  name: string;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => unknown;
  value: string;
  style?: Record<string, string>;
}) => {
  return (
    <div className="position-relative">
      <i className="bi bi-search p-2 position-absolute end-0"></i>
      <input
        name={name}
        placeholder={placeholder ?? "Search here..."}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(e.target.value.trim());
          }
        }}
        value={value.trim() ?? ""}
        className={`form-control w-100 ${className}`}
        style={style}
      />
    </div>
  );
};

export default SerachBox;

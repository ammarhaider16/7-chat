import React from "react";

export const FormComponent = ({
  id,
  placeholder,
  value,
  handleChange,
  labelText,
}) => {
  let inputClassName = "form-input";
  if (id == "additionalInfo" || id == "purpose") {
    inputClassName = "form-input-longer";
  }

  return (
    <div style={{ fontSize: "2vh", textAlign: "left", marginTop: "20px" }}>
      <label htmlFor={id} className="input-label">
        {labelText}
      </label>
      <br></br>
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={inputClassName}
      />
    </div>
  );
};

export default FormComponent;

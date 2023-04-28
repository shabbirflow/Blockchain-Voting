import React, { useContext } from "react";

import Style from "./Input.module.css";

export const Input = ({
  title,
  placeholder,
  inputType,
  handleChange,
  required,
}) => {
  return (
    <div className={Style.inputContainer}>
      <p className={Style.inputTitle}>{title}</p>
      <div className={Style.inputDiv}>
        {/* {inputType === "text" ? ( */}
          <input
            type={inputType}
            className={Style.inputText}
            placeholder={placeholder}
            onChange={handleChange}
            required={required}
          />
      </div>
    </div>
  );
};

export default Input;

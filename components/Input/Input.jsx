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
      <p>{title}</p>
      <div className={Style.inputDiv}>
        {inputType === "text" ? (
          <input
            type="text"
            className={Style.inputText}
            placeholder={placeholder}
            onChange={handleChange}
            required={required}
          />
        ) : (
          <div>lol</div>
        )}
      </div>
    </div>
  );
};

export default Input;

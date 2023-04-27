import React from "react";
import Style from "./Button.module.css";

const Button = ({ handleClick, btnName }) => {
  return (
    <button className="button" onClick={handleClick} type="button">
      {btnName}
    </button>
  );
};

export default Button;

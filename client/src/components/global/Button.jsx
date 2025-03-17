import React from "react";
import { BUTTONS_VARIANT } from "../../constants/buttonVariants";

const Button = ({ children, variant, handleOnClick, className = '' }) => {
  return (
    <button
      onClick={handleOnClick}
      className={`cursor-pointer rounded-full ${
        BUTTONS_VARIANT[variant] ?? BUTTONS_VARIANT.primary
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;

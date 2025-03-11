import React from "react";
import { BUTTONS_VARIANT } from "../../constants/buttonVariants";

const Button = ({ children, variant, handleOnClick }) => {
  return (
    <button
      onClick={handleOnClick}
      className={`px-10 py-3 cursor-pointer rounded-full ${
        BUTTONS_VARIANT[variant] ?? BUTTONS_VARIANT.primary
      }`}
    >
      {children}
    </button>
  );
};

export default Button;

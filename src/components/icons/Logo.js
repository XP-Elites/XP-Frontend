import React from "react";
import codeshield from "./CodeShield.png"; // or .svg

const Logo = ({ size = 60, alt = "CodeShield", className }) => (
  <img
    src={codeshield}
    alt={alt}
    className={className}
    style={{ width: size, height: "auto", display: "block" }}
  />
);

export default Logo;

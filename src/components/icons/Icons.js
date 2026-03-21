import React from "react";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";

const iconLibraries = [MdIcons, FaIcons, Fa6Icons];

const Icons = ({ icon, size = 18, style = "Default" }) => {
  let IconComponent;
  for (const lib of iconLibraries) {
    if (lib[icon]) {
      IconComponent = lib[icon];
      break;
    }
  }
  if (!IconComponent) return null;
  const iconStyle = styles[style] || styles.Default;
  return <IconComponent size={size} color={iconStyle.color} />;
};

const styles = {
  Default: { color: "#7e7e7e" },
  Black: { color: "#000000" },
};

export default Icons;

import React from "react";
import * as MdIcons from "react-icons/md";

const Icons = ({ icon, size = 18, style = "Default" }) => {
  const IconComponent = MdIcons[icon]; // e.g. "MdHome", "MdSettings"
  if (!IconComponent) return null;
  const iconStyle = styles[style] || styles.Default;
  return <IconComponent size={size} color={iconStyle.color} />;
};

const styles = {
  Default: { color: "#7e7e7e" },
};

export default Icons;

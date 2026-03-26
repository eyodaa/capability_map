import React from "react";
import { getColor } from "../../utils/colorUtils";

const CapabilityBox = ({ capability, onClick }) => {

  // ✅ Use calculated maturity if available, fallback to original
  const maturity =
    capability.calculated_maturity ?? capability.maturity_level;

  const backgroundColor = getColor(maturity);

  return (
    <div
      className="capability-box"
      style={{
        backgroundColor,
        transition: "background-color 0.3s ease"
      }}
      onClick={onClick}
    >
      <h4>{capability.name}</h4>
      <p>Maturity : {maturity}</p>
    </div>
  );
};

export default CapabilityBox;
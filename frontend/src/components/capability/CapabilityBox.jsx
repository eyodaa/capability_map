import React from "react";
import { getColor } from "../../utils/colorUtils";

const CapabilityBox = ({ capability, onClick }) => {
  const maturity =
    capability.calculated_maturity ?? capability.maturity_level;

  const maturityColor = getColor(maturity);

  return (
    <div
      className="capability-box"
      onClick={onClick}
      style={{
        borderTop: `5px solid ${maturityColor}`
      }}
    >
      <div className="capability-header">
        <span
          className="maturity-dot"
          style={{ backgroundColor: maturityColor }}
        />

        <h4>{capability.name}</h4>
      </div>

      <p className="maturity-text">
        Maturity Level: <strong>{maturity}</strong>
      </p>
    </div>
  );
};

export default CapabilityBox;
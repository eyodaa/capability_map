
import React from "react";
import "./CapabilityGrid.css";
import { useState } from "react";
import CapabilityBox from "./CapabilityBox";
import { computeCapabilityMaturity } from "../../utils/capabilityUtils";

function CapabilityGrid({ capabilities, onSelect }) {

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  // ✅ Compute maturity with hierarchy logic
  const maturityMap = computeCapabilityMaturity(capabilities);

  const parents = capabilities.filter(c => !c.parent_id);

  const getChildren = (id) =>
    capabilities.filter(c => c.parent_id === id);

  return (
    <div className="nested-grid-layout">

      {parents.map(parent => {

        const children = getChildren(parent.id);
        const parentActive = selectedParent === parent.id;

        return (
          <div key={parent.id} className="nested-grid-layout">

            {/* PARENT */}
            <CapabilityBox
              capability={maturityMap[parent.id]}   // ✅ FIXED
              onClick={() => {
                setSelectedParent(parent.id);
                setSelectedChild(null);
                onSelect(maturityMap[parent.id]);  // ✅ FIXED
              }}
            />

            {/* CHILDREN */}
            {parentActive && (
              <div className="children-row">

                {children.map(child => {

                  const subChildren = getChildren(child.id);
                  const childActive = selectedChild === child.id;

                  return (
                    <div key={child.id} className="child-card">

                      <CapabilityBox
                        capability={maturityMap[child.id]}   // ✅ FIXED
                        onClick={() => {
                          setSelectedChild(child.id);
                          onSelect(maturityMap[child.id]);  // ✅ FIXED
                        }}
                      />

                      {/* SUB CHILDREN */}
                      {childActive && (
                        <div className="sub-row">

                          {subChildren.map(sub => (
                            <CapabilityBox
                              key={sub.id}
                              capability={maturityMap[sub.id]}   // ✅ FIXED
                              onClick={() => onSelect(maturityMap[sub.id])} // ✅ FIXED
                            />
                          ))}

                        </div>
                      )}

                    </div>
                  );

                })}

              </div>
            )}

          </div>
        );

      })}

    </div>
  );
}

export default CapabilityGrid;



import React from "react";
import "./CapabilityGrid.css";
import { useState } from "react";
import CapabilityBox from "./CapabilityBox";
import { computeCapabilityMaturity } from "../../utils/capabilityUtils";

function CapabilityGrid({ capabilities, onSelect }) {

  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);


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

            
            <CapabilityBox
              capability={maturityMap[parent.id]}   
              onClick={() => {
                setSelectedParent(parent.id);
                setSelectedChild(null);
                onSelect(maturityMap[parent.id]); 
              }}
            />

            
            {parentActive && (
              <div className="children-row">

                {children.map(child => {

                  const subChildren = getChildren(child.id);
                  const childActive = selectedChild === child.id;

                  return (
                    <div key={child.id} className="child-card">

                      <CapabilityBox
                        capability={maturityMap[child.id]}   
                        onClick={() => {
                          setSelectedChild(child.id);
                          onSelect(maturityMap[child.id]);  
                        }}
                      />

                      
                      {childActive && (
                        <div className="sub-row">

                          {subChildren.map(sub => (
                            <CapabilityBox
                              key={sub.id}
                              capability={maturityMap[sub.id]}   
                              onClick={() => onSelect(maturityMap[sub.id])} 
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


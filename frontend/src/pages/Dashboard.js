import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CapabilityGrid from "../components/capability/CapabilityGrid";
import {
  getCapabilities,
  saveAllCapabilities
} from "../services/capabilityService";
import DescriptionPanel from "../components/layout/DescriptionPanel";
import { computeCapabilityMaturity } from "../utils/capabilityUtils";
import "./dashboard.css";
function Dashboard() {
  const [boxes, setBoxes] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
const [currentParentId, setCurrentParentId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);


  const updateCapabilityLocal = (id, updates) => {
    setBoxes((prev) => {
  
      const updated = prev.map((box) =>
        box.id === id ? { ...box, ...updates } : box
      );

      
      const maturityMap = computeCapabilityMaturity(updated);

      
      return updated.map((box) => ({
        ...box,
        maturity_level:
          maturityMap[box.id]?.calculated_maturity || box.maturity_level
      }));
    });
  };

  
  const handleGlobalSave = async () => {
    if (boxes.length === 0) return;

    setIsSaving(true);
    try {
      
      const maturityMap = computeCapabilityMaturity(boxes);

      const finalDataToSave = boxes.map((box) => ({
        ...box,
        maturity_level:
          maturityMap[box.id]?.calculated_maturity || box.maturity_level
      }));

      console.log("Saving computed values to DB:", finalDataToSave);

      await saveAllCapabilities({ capabilities: finalDataToSave });

      alert("Full hierarchy saved successfully!");
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };


  const handleParentSelect = async (parent) => {
    setCurrentParentId(parent.id);

    try {
      const res = await getCapabilities(parent.id);

      const initialData = [
        { ...parent, level: 1 },
        ...res.data.map((child) => ({
          ...child,
          level: 2
        }))
      ];

      
      const maturityMap = computeCapabilityMaturity(initialData);

      const computedData = initialData.map((box) => ({
        ...box,
        maturity_level:
          maturityMap[box.id]?.calculated_maturity || box.maturity_level
      }));

      setBoxes(computedData);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  
  const handleBoxClick = async (capability) => {
    setSelectedDescription(capability);

    try {
      const res = await getCapabilities(capability.id);

      setBoxes((prev) => {
        const alreadyLoaded = prev.some(
          (item) => item.parent_id === capability.id
        );
        if (alreadyLoaded) return prev;

        const parentItem = prev.find((item) => item.id === capability.id);
        const parentLevel = parentItem?.level || 1;

        const childrenWithLevel = res.data.map((child) => ({
          ...child,
          level: parentLevel + 1
        }));

        const updated = [...prev, ...childrenWithLevel];

        
        const maturityMap = computeCapabilityMaturity(updated);

        return updated.map((box) => ({
          ...box,
          maturity_level:
            maturityMap[box.id]?.calculated_maturity || box.maturity_level
        }));
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
/*
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f8f9fa"
      }}
    >
      <Sidebar onParentSelect={handleParentSelect} />

      <div
        style={{
          flex: 1,
          padding: "20px",
          position: "relative",
          overflowY: "auto"
        }}
      >
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px"
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>Capability Map</h2>

          <button
            onClick={handleGlobalSave}
            disabled={isSaving || boxes.length === 0}
            style={{
              padding: "10px 20px",
              backgroundColor: isSaving ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isSaving ? "not-allowed" : "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <CapabilityGrid
          capabilities={boxes}
          onSelect={handleBoxClick}
        />
      </div>

      <DescriptionPanel
        item={selectedDescription}
        updateCapabilityLocal={updateCapabilityLocal}
      />
    </div>
  );
}

export default Dashboard;*/

return (
  <div className="dashboard">
    
    <div className="sidebar">
      <Sidebar onParentSelect={handleParentSelect} />
    </div>

    <div className="main">
      {/* HEADER */}
      <div className="header">
        <h2>Capability Map</h2>

        <button
          onClick={handleGlobalSave}
          disabled={isSaving || boxes.length === 0}
          className="save-btn"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid-container">
        <CapabilityGrid
          capabilities={boxes}
          onSelect={handleBoxClick}
        />
      </div>
    </div>

    <div className="details">
      <DescriptionPanel
        item={selectedDescription}
        updateCapabilityLocal={updateCapabilityLocal}
      />
    </div>

  </div>
);
  
}
export default Dashboard;
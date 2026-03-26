/*import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CapabilityGrid from "../components/capability/CapabilityGrid";
import { getCapabilities, saveAllCapabilities } from "../services/capabilityService";
import DescriptionPanel from "../components/layout/DescriptionPanel";
// Add this at the top of Dashboard.js
import { computeCapabilityMaturity } from "../utils/capabilityUtils";
function Dashboard() {
  const [boxes, setBoxes] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Added for UI feedback

  // ✅ Update local state
  const updateCapabilityLocal = (id, updates) => {
  setBoxes((prev) => {
    // 1. Create a fresh copy of all boxes with the new child data
    let newBoxes = prev.map((box) =>
      box.id === id ? { ...box, ...updates } : box
    );

    // 2. Find the item we just changed to get its parent_id
    const changedItem = newBoxes.find((b) => b.id === id);
    if (!changedItem || !changedItem.parent_id) return newBoxes;

    // --- STEP A: RECALCULATE PARENT ---
    const parentId = changedItem.parent_id;
    const siblings = newBoxes.filter((b) => b.parent_id === parentId);
    
    if (siblings.length > 0) {
      const avgMaturity = Math.round(
        siblings.reduce((acc, curr) => acc + (Number(curr.maturity_level) || 1), 0) / siblings.length
      );

      // Update the parent in our local array
      newBoxes = newBoxes.map((box) =>
        box.id === parentId ? { ...box, maturity_level: avgMaturity } : box
      );
    }

    // --- STEP B: RECALCULATE GRANDPARENT ---
    const parentItem = newBoxes.find((b) => b.id === parentId);
    if (parentItem && parentItem.parent_id) {
      const grandParentId = parentItem.parent_id;
      const parentSiblings = newBoxes.filter((b) => b.parent_id === grandParentId);

      if (parentSiblings.length > 0) {
        const grandAvg = Math.round(
          parentSiblings.reduce((acc, curr) => acc + (Number(curr.maturity_level) || 1), 0) / parentSiblings.length
        );

        // Update the grandparent in our local array
        newBoxes = newBoxes.map((box) =>
          box.id === grandParentId ? { ...box, maturity_level: grandAvg } : box
        );
      }
    }

    return newBoxes;

  });
};
const handleGlobalSave = async () => {
  if (boxes.length === 0) return;

  setIsSaving(true);
  try {
    // 🕵️ CRITICAL STEP: Use your utility to get the "Truth" 
    // before sending to the database.
    const maturityMap = computeCapabilityMaturity(boxes);

    // Create a new array where the maturity_level matches the calculated map
    const finalDataToSave = boxes.map(box => ({
  ...box,
  maturity_level: maturityMap[box.id]?.calculated_maturity || box.maturity_level
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
// ✅ Select parent - Update this to ensure it fetches fresh data
// ✅ Update this section in your Dashboard.jsx
const handleParentSelect = async (parent) => {
  setCurrentParentId(parent.id);
  
  // Refresh the children immediately from the DB
  const res = await getCapabilities(parent.id); 
  
  // Update state with the FRESH data from the database
  setBoxes([
    { ...parent, level: 1 }, 
    ...res.data.map(child => ({ ...child, level: 2 }))
  ]);
};
  // ✅ Expand hierarchy
  const handleBoxClick = async (capability) => {
    setSelectedDescription(capability);
    try {
      const res = await getCapabilities(capability.id);
      setBoxes((prev) => {
        const alreadyLoaded = prev.some(item => item.parent_id === capability.id);
        if (alreadyLoaded) return prev;

        const parentItem = prev.find(item => item.id === capability.id);
        const parentLevel = parentItem?.level || 1;
        
        const childrenWithLevel = res.data.map(child => ({
          ...child,
          level: parentLevel + 1
        }));
        return [...prev, ...childrenWithLevel];
      });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa" }}>
      
      <Sidebar onParentSelect={handleParentSelect} />

      <div style={{ flex: 1, padding: "20px", position: "relative", overflowY: "auto" }}>
        
        {/* --- HEADER SECTION WITH SAVE BUTTON --- *}
        <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px"
        }}>
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
            {isSaving ? "Saving..." : "Save Changes to DB"}
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
import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CapabilityGrid from "../components/capability/CapabilityGrid";
import {
  getCapabilities,
  saveAllCapabilities
} from "../services/capabilityService";
import DescriptionPanel from "../components/layout/DescriptionPanel";
import { computeCapabilityMaturity } from "../utils/capabilityUtils";

function Dashboard() {
  const [boxes, setBoxes] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ CLEAN: Single source of truth for updating + recalculating
  const updateCapabilityLocal = (id, updates) => {
    setBoxes((prev) => {
      // Step 1: apply update
      const updated = prev.map((box) =>
        box.id === id ? { ...box, ...updates } : box
      );

      // Step 2: recompute ALL maturity using your utility
      const maturityMap = computeCapabilityMaturity(updated);

      // Step 3: overwrite maturity_level with calculated value
      return updated.map((box) => ({
        ...box,
        maturity_level:
          maturityMap[box.id]?.calculated_maturity || box.maturity_level
      }));
    });
  };

  // ✅ SAVE: persist computed values to DB
  const handleGlobalSave = async () => {
    if (boxes.length === 0) return;

    setIsSaving(true);
    try {
      // Always compute before saving (safety)
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

  // ✅ Load root + children
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

      // Compute initial maturity
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

  // ✅ Expand hierarchy
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

        // Recalculate after expansion
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
        {/* HEADER */}
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

export default Dashboard;
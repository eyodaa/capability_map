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
  const [isSaving, setIsSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // ✅ Single source of truth
  const selectedDescription = boxes.find(
    (box) => box.id === selectedId
  );

  // ✅ FIXED FUNCTION
  const updateCapabilityLocal = (id, updates) => {
    setBoxes((prev) => {
      const updated = prev.map((box) =>
        box.id === id ? { ...box, ...updates } : box
      );

      const maturityMap = computeCapabilityMaturity(updated);

      const finalUpdated = updated.map((box) => ({
        ...box,
        maturity_level:
          maturityMap[box.id]?.calculated_maturity || box.maturity_level
      }));

      return finalUpdated; // ✅ ONLY return here
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
    setSelectedId(capability.id);

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

  return (
    <div className="dashboard">
      <div className="sidebar">
        <Sidebar onParentSelect={handleParentSelect} />
      </div>

      <div className="main">
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
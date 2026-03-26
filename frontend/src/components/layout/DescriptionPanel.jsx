import { useState, useEffect } from "react";
import { updateCapability } from "../../services/capabilityService";

const DescriptionPanel = ({ item, refreshCapabilities, updateCapabilityLocal }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");

  useEffect(() => {
    if (item) {
      setDescription(item.description || "");
      setLevel(item.maturity_level || 1);
      setIsEditing(false);
    }
  }, [item]);

  if (!item) {
    return (
      <aside className="w-96 bg-slate-50 border-l border-slate-200 flex items-center justify-center p-10 text-center">
        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8">
          <p className="text-slate-400 font-medium">
            Select a Capability Node to inspect details
          </p>
        </div>
      </aside>
    );
  }

  const levelThemes = {
    3: "border-green-500 text-green-600 bg-green-50",
    2: "border-orange-500 text-orange-600 bg-orange-50",
    1: "border-red-500 text-red-600 bg-red-50",
  };
/*
 const handleSave = async () => {
  try {

    console.log("Updating capability:", item.id);
    console.log("New level:", level);

    await updateCapability(item.id, {
  description: description,
  maturity_level: level
});


// update dashboard state instantly
if (updateCapabilityLocal) {
  updateCapabilityLocal(item.id, {
    description: description,
    maturity_level: level
  });
}

    setIsEditing(false);

    if (refreshCapabilities) {
      refreshCapabilities();
    }

  } catch (error) {
    console.error("Update failed", error);
  }
};
*/const handleSave = async () => {
  // 1. Update the local Dashboard state instantly
  if (updateCapabilityLocal) {
    updateCapabilityLocal(item.id, {
      description: description,
      maturity_level: parseInt(level, 10) // 🛡️ Ensure it's a number
    });
  }

  // 2. Close the editing mode
  setIsEditing(false);
  
  // 3. Optional: Add a small visual hint that they still need to click the 
  // Global Save button to make it permanent.
  console.log("Local state updated. Click 'Save to Database' to persist.");
};
  return (
    <aside className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-inner">

      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">

        <div
          className={`inline-block px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tighter mb-3 ${levelThemes[level]}`}
        >
          {level} Capability
        </div>

        <h2 className="text-2xl font-black text-slate-800 leading-tight">
          {item.name}
        </h2>

      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">

          <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
            Objective
          </h4>

          {!isEditing ? (
            <p className="text-slate-600 text-sm leading-relaxed">
              {description || "No strategic description available for this specific node."}
            </p>
          ) : (
            <textarea
              className="w-full border rounded-lg p-2 text-sm"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}

        </div>
        {/* Maturity Level Editing */}
        {isEditing && (
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">

            <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">
              Maturity 
            </h4>
           <select
  className="w-full border rounded-lg p-2 bg-white"
  value={level}
  onChange={(e) => setLevel(parseInt(e.target.value, 10))} // 👈 Convert to Number here
>
  <option value={1}>🔴 (Low Maturity)</option>
  <option value={2}>🟠 (Medium Maturity)</option>
  <option value={3}>🟢 (High Maturity)</option>
</select>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-2">

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-3 rounded-lg transition-transform active:scale-95 shadow-md"
          >
            Edit Capability Details
          </button>
          
        ) : (
          <>
            <button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-3 rounded-lg shadow-md"
            >
              Save Changes
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="w-full bg-gray-300 hover:bg-gray-400 text-xs font-bold py-3 rounded-lg"
            >
              Cancel
            </button>
          </>
        )}

      </div>

    </aside>
  );
};

export default DescriptionPanel;
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Save, GripVertical, Trash2 } from 'lucide-react';

const AddCapability = () => {
  const [capabilities, setCapabilities] = useState([]);

  // Automatically manages the 1, 1.1, 1.1.1 hierarchy labels
  const assignLevels = (list, parentLevel = "") => {
    return list.map((item, index) => {
      const currentLevel = parentLevel ? `${parentLevel}.${index + 1}` : `${index + 1}`;
      return {
        ...item,
        level: currentLevel,
        children: assignLevels(item.children || [], currentLevel),
      };
    });
  };

  const addCapability = (parentId = null) => {
    const newNode = {
      id: `temp-${Date.now()}`, // Temporary ID for frontend DnD
      name: "New Capability",
      description: "",
      maturity_level: 1, // Matches your INT column
      children: [],
    };

    if (!parentId) {
      setCapabilities(assignLevels([...capabilities, newNode]));
    } else {
      const addToChild = (list) => {
        return list.map(item => {
          if (item.id === parentId) {
            return { ...item, children: [...item.children, newNode] };
          }
          return { ...item, children: addToChild(item.children) };
        });
      };
      setCapabilities(assignLevels(addToChild(capabilities)));
    }
  };

  const deleteCapability = (id) => {
    if (!window.confirm("Delete this capability and all its sub-groups?")) return;
    const removeFromTree = (list) => {
      return list
        .filter(item => item.id !== id)
        .map(item => ({ ...item, children: removeFromTree(item.children) }));
    };
    setCapabilities(assignLevels(removeFromTree(capabilities)));
  };

  // --- DATABASE SAVE LOGIC ---
  const handleSaveAll = async () => {
    const flatList = [];

    // Converts the nested UI into a flat list for your MySQL table
    const flatten = (nodes, parentDatabaseId = null) => {
      nodes.forEach(node => {
        flatList.push({
          id: node.id.includes('temp-') ? null : node.id, 
          name: node.name,
          description: node.description,
          parent_id: parentDatabaseId, // Correct column from your screenshot
          maturity_level: parseInt(node.maturity_level)
        });
        if (node.children && node.children.length > 0) {
          flatten(node.children, node.id);
        }
      });
    };

    flatten(capabilities);
    console.log("Sending to DB:", flatList); // Check this in your browser console!

    try {
      // Ensure this URL matches your ARCHI-MAP backend endpoint
      const response = await fetch('http://localhost:5000/api/capabilities/save-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capabilities: flatList })
      });
      
      if (response.ok) {
        alert("✅ Data saved! Refresh phpMyAdmin to see the items.");
      } else {
        alert("❌ Failed to save. Check your backend terminal for SQL errors.");
      }
    } catch (error) {
      alert("❌ Connection error. Is your backend server running?");
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Build Capability Hierarchy</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => addCapability()} style={btnStyle("#6366f1")}>
              <Plus size={16} /> Add Root Capability
            </button>
            <button onClick={handleSaveAll} style={btnStyle("#10b981")}>
              <Save size={16} /> Save All
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="capabilities">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {capabilities.map((cap, index) => (
                  <CapabilityCard 
                    key={cap.id} cap={cap} index={index} 
                    addCapability={addCapability} deleteCapability={deleteCapability}
                    setCapabilities={setCapabilities} allCaps={capabilities}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

const CapabilityCard = ({ cap, index, addCapability, deleteCapability, setCapabilities, allCaps }) => {
  // Updates the specific field in the nested state array
  const updateField = (id, field, value) => {
    const updateInTree = (list) => {
      return list.map(item => {
        if (item.id === id) return { ...item, [field]: value };
        return { ...item, children: updateInTree(item.children || []) };
      });
    };
    setCapabilities(updateInTree(allCaps));
  };

  return (
    <Draggable draggableId={cap.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} style={{
            backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px',
            padding: '20px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'relative', ...provided.draggableProps.style
          }}>
          <button onClick={() => deleteCapability(cap.id)} style={{
              position: 'absolute', top: '10px', right: '10px', background: 'transparent',
              border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px'
            }}><Trash2 size={18} /></button>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div {...provided.dragHandleProps} style={{ color: '#9ca3af', cursor: 'grab' }}><GripVertical /></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>{cap.level}</span>
                <input 
                  value={cap.name} 
                  onChange={(e) => updateField(cap.id, 'name', e.target.value)}
                  style={{ border: 'none', fontSize: '18px', fontWeight: '600', width: '80%', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <textarea 
                  value={cap.description}
                  onChange={(e) => updateField(cap.id, 'description', e.target.value)}
                  placeholder="Description" 
                  style={{ flex: 2, padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} 
                />
                <select 
                  value={cap.maturity_level}
                  onChange={(e) => updateField(cap.id, 'maturity_level', e.target.value)}
                  style={{ flex: 0.5, padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                </select>
              </div>

              <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => addCapability(cap.id)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>+ Add Sub-group</button>
              </div>

              {cap.children && cap.children.length > 0 && (
                <div style={{ marginTop: '20px', paddingLeft: '30px', borderLeft: '2px solid #f3f4f6' }}>
                  {cap.children.map((child, idx) => (
                    <CapabilityCard key={child.id} cap={child} index={idx} addCapability={addCapability} deleteCapability={deleteCapability} setCapabilities={setCapabilities} allCaps={allCaps} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const btnStyle = (bg) => ({
  backgroundColor: bg, color: 'white', padding: '10px 16px', borderRadius: '8px',
  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
  fontWeight: '600', fontSize: '14px'
});

export default AddCapability;
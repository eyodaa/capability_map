import React, { useState, useEffect } from 'react';

import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';

import {
  Plus,
  Save,
  GripVertical,
  Trash2
} from 'lucide-react';

import Header from './header'; // ✅ IMPORT HEADER

const AddCapability = () => {

  const [capabilities, setCapabilities] = useState([]);
  const [rootIdInput, setRootIdInput] = useState("");

  // =====================================
  // ASSIGN LEVELS
  // =====================================

  const assignLevels = (
    list,
    parentLevel = ""
  ) => {

    return list.map((item, index) => {

      const currentLevel = parentLevel
        ? `${parentLevel}.${index + 1}`
        : `${index + 1}`;

      return {
        ...item,
        level: currentLevel,

        children: assignLevels(
          item.children || [],
          currentLevel
        ),
      };
    });
  };

  // =====================================
  // FETCH TREE
  // =====================================

  useEffect(() => {

    const fetchTree = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/capabilities/tree"
        );

        const data = await res.json();

        setCapabilities(assignLevels(data));

        console.log("Loaded tree:", data);

      } catch (err) {

        console.error(
          "❌ Failed to load tree:",
          err
        );
      }
    };

    fetchTree();

  }, []);

  // =====================================
  // GET ALL IDS
  // =====================================

  const getAllIds = (
    list,
    acc = new Set()
  ) => {

    list.forEach(item => {

      acc.add(item.id);

      if (item.children?.length) {

        getAllIds(item.children, acc);

      }
    });

    return acc;
  };

  // =====================================
  // GENERATE CHILD ID
  // =====================================

  const generateChildId = (
    parentId,
    allIds
  ) => {

    let index = 1;

    while (true) {

      const newId =
        `${parentId}-${String(index).padStart(2, "0")}`;

      if (!allIds.has(newId))
        return newId;

      index++;
    }
  };

  // =====================================
  // ADD ROOT
  // =====================================

  const addRootCapability = () => {

    if (
      !rootIdInput ||
      !rootIdInput.startsWith("CB-")
    ) {

      alert(
        "Root ID must start with CB- (example: CB-15)"
      );

      return;
    }

    const allIds = getAllIds(capabilities);

    if (allIds.has(rootIdInput)) {

      alert("❌ ID already exists");

      return;
    }

    const newNode = {
      id: rootIdInput,
      name: "New Capability",
      description: "",
      maturity_level: 1,
      children: [],
    };

    setCapabilities(
      assignLevels([
        ...capabilities,
        newNode
      ])
    );

    setRootIdInput("");
  };

  // =====================================
  // ADD CHILD
  // =====================================

  const addCapability = (parentId) => {

    setCapabilities(prev => {

      const allIds = getAllIds(prev);

      const newId =
        generateChildId(parentId, allIds);

      const newNode = {
        id: newId,
        name: "New Capability",
        description: "",
        maturity_level: 1,
        children: [],
      };

      const addToTree = (list) => {

        return list.map(item => {

          if (item.id === parentId) {

            return {
              ...item,
              children: [
                ...item.children,
                newNode
              ]
            };
          }

          return {
            ...item,
            children: addToTree(
              item.children || []
            )
          };
        });
      };

      return assignLevels(addToTree(prev));
    });
  };

  // =====================================
  // DELETE
  // =====================================

  const deleteCapability = async (id) => {

    if (
      !window.confirm(
        "Delete this capability and all its sub-groups?"
      )
    ) return;

    const removeFromTree = (list) => {

      return list
        .filter(item => item.id !== id)

        .map(item => ({
          ...item,

          children: removeFromTree(
            item.children || []
          )
        }));
    };

    setCapabilities(
      assignLevels(
        removeFromTree(capabilities)
      )
    );

    try {

      await fetch(
        "http://localhost:5000/api/delete-by-id",
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({ id })
        }
      );

    } catch (err) {

      console.error(err);

      alert(
        "❌ Server error while deleting from database"
      );
    }
  };

  // =====================================
  // DELETE BY NAME
  // =====================================

  const deleteByName = async () => {

    let input = window.prompt(
      "Enter EXACT capability name to delete:"
    );

    if (!input) return;

    const targetName = input.trim();

    let targetId = null;

    const findIdByName = (list) => {

      for (const item of list) {

        if (item.name === targetName) {

          targetId = item.id;

          return true;
        }

        if (
          item.children &&
          item.children.length > 0
        ) {

          if (
            findIdByName(item.children)
          ) return true;
        }
      }

      return false;
    };

    findIdByName(capabilities);

    if (targetId) {

      await deleteCapability(targetId);

    } else {

      alert(
        `❌ No capability found with the name: "${targetName}"`
      );
    }
  };

  // =====================================
  // SAVE ALL
  // =====================================

  const handleSaveAll = async () => {

    const flatList = [];

    const flatten = (
      nodes,
      parentId = null
    ) => {

      nodes.forEach(node => {

        flatList.push({
          id: node.id,
          name: node.name,
          description:
            node.description || "",
          parent_id: parentId,

          maturity_level:
            Number(node.maturity_level) || 1
        });

        if (node.children?.length) {

          flatten(node.children, node.id);

        }
      });
    };

    flatten(capabilities);

    try {

      const res = await fetch(
        'http://localhost:5000/api/create-tree',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(flatList)
        }
      );

      const data = await res.json();

      if (res.ok)
        alert("✅ " + data.message);

      else
        alert("❌ " + data.error);

    } catch {

      alert("❌ Connection error");

    }
  };

  // =====================================
  // UI
  // =====================================

  return (

    <div
      style={{
        backgroundColor: '#f4f6f9',
        minHeight: '100vh',
        fontFamily: 'Segoe UI'
      }}
    >

      {/* ✅ HEADER */}
      <Header />

      {/* PAGE */}
      <div
        style={{
          padding: '40px'
        }}
      >

        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >

          {/* TOP SECTION */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >

            <div>

              <h1
                style={{
                  margin: 0,
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  color: '#111827'
                }}
              >
                Build Capability Hierarchy
              </h1>

              <p
                style={{
                  color: '#6b7280',
                  marginTop: '8px'
                }}
              >
                Create and organize business capabilities
              </p>

            </div>

            {/* ACTIONS */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >

              <input
                value={rootIdInput}

                onChange={(e) =>
                  setRootIdInput(
                    e.target.value
                  )
                }

                placeholder="CB-15"

                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  minWidth: '120px'
                }}
              />

              <button
                onClick={addRootCapability}
                style={btnStyle("#4f46e5")}
              >
                <Plus size={16} />
                Add Root
              </button>

              <button
                onClick={deleteByName}
                style={btnStyle("#dc2626")}
              >
                <Trash2 size={16} />
                Delete by Name
              </button>

              <button
                onClick={handleSaveAll}
                style={btnStyle("#059669")}
              >
                <Save size={16} />
                Save All
              </button>

            </div>

          </div>

          {/* TREE */}
          <DragDropContext
            onDragEnd={() => {}}
          >

            <Droppable droppableId="capabilities">

              {(provided) => (

                <div
                  {...provided.droppableProps}

                  ref={provided.innerRef}
                >

                  {capabilities.map(
                    (cap, index) => (

                      <CapabilityCard
                        key={cap.id}

                        cap={cap}

                        index={index}

                        addCapability={
                          addCapability
                        }

                        deleteCapability={
                          deleteCapability
                        }

                        setCapabilities={
                          setCapabilities
                        }

                        allCaps={capabilities}
                      />

                    )
                  )}

                  {provided.placeholder}

                </div>

              )}

            </Droppable>

          </DragDropContext>

        </div>

      </div>

    </div>
  );
};

// =====================================
// CARD COMPONENT
// =====================================

const CapabilityCard = ({
  cap,
  index,
  addCapability,
  deleteCapability,
  setCapabilities,
  allCaps
}) => {

  const updateField = (
    id,
    field,
    value
  ) => {

    const update = (list) =>

      list.map(item =>

        item.id === id

          ? {
              ...item,
              [field]: value
            }

          : {
              ...item,
              children: update(
                item.children || []
              )
            }

      );

    setCapabilities(update(allCaps));
  };

  return (

    <Draggable
      draggableId={cap.id}
      index={index}
    >

      {(provided) => (

        <div

          ref={provided.innerRef}

          {...provided.draggableProps}

          style={{
            backgroundColor: 'white',

            border:
              '1px solid #e5e7eb',

            borderRadius: '16px',

            padding: '22px',

            marginBottom: '18px',

            position: 'relative',

            boxShadow:
              '0 3px 10px rgba(0,0,0,0.04)',

            ...provided.draggableProps.style
          }}
        >

          {/* DELETE */}
          <button

            onClick={() =>
              deleteCapability(cap.id)
            }

            style={{
              position: 'absolute',

              top: '14px',

              right: '14px',

              background: 'transparent',

              border: 'none',

              color: '#ef4444',

              cursor: 'pointer'
            }}
          >

            <Trash2 size={18} />

          </button>

          <div
            style={{
              display: 'flex',
              gap: '15px'
            }}
          >

            {/* DRAG */}
            <div
              {...provided.dragHandleProps}
              style={{
                cursor: 'grab',
                color: '#6b7280'
              }}
            >

              <GripVertical />

            </div>

            {/* CONTENT */}
            <div style={{ flex: 1 }}>

              {/* NAME */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '12px',
                  alignItems: 'center'
                }}
              >

                <span
                  style={{
                    fontWeight: '700',
                    color: '#4b5563',
                    minWidth: '50px'
                  }}
                >
                  {cap.level}
                </span>

                <input
                  style={inputStyle}

                  value={cap.name}

                  onChange={(e) =>
                    updateField(
                      cap.id,
                      'name',
                      e.target.value
                    )
                  }
                />

              </div>

              {/* DESCRIPTION */}
              <textarea
                style={textareaStyle}

                value={cap.description}

                onChange={(e) =>
                  updateField(
                    cap.id,
                    'description',
                    e.target.value
                  )
                }
              />

              {/* ACTIONS */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >

                <select
                  style={selectStyle}

                  value={cap.maturity_level}

                  onChange={(e) =>
                    updateField(
                      cap.id,
                      'maturity_level',
                      e.target.value
                    )
                  }
                >

                  <option value={1}>
                    Low
                  </option>

                  <option value={2}>
                    Medium
                  </option>

                  <option value={3}>
                    High
                  </option>

                </select>

                <button
                  onClick={() =>
                    addCapability(cap.id)
                  }

                  style={{
                    background: '#eef2ff',

                    border:
                      '1px solid #c7d2fe',

                    padding: '8px 14px',

                    borderRadius: '8px',

                    cursor: 'pointer',

                    fontWeight: '600'
                  }}
                >
                  + Add Sub-group
                </button>

              </div>

              {/* CHILDREN */}
              <div
                style={{
                  marginTop: '20px',

                  borderLeft:
                    '2px dashed #d1d5db',

                  paddingLeft: '20px'
                }}
              >

                {cap.children?.map(
                  (child, idx) => (

                    <CapabilityCard
                      key={child.id}

                      cap={child}

                      index={idx}

                      addCapability={
                        addCapability
                      }

                      deleteCapability={
                        deleteCapability
                      }

                      setCapabilities={
                        setCapabilities
                      }

                      allCaps={allCaps}
                    />

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </Draggable>

  );
};

// =====================================
// STYLES
// =====================================

const btnStyle = (bg) => ({
  backgroundColor: bg,
  color: 'white',
  padding: '10px 16px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '600'
});

const inputStyle = {
  flex: 1,
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  fontSize: '0.95rem'
};

const textareaStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  marginBottom: '14px',
  minHeight: '70px',
  resize: 'vertical',
  fontSize: '0.95rem',
  boxSizing: 'border-box'
};

const selectStyle = {
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db'
};

export default AddCapability;
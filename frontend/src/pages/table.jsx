import React, { useState, useEffect } from "react";

import {
  getParents,
  getCapabilities,
  updateCapability,
  deleteCapability,
} from "../services/capabilityService";

import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import "./table.css";
import Header from "./header";

const TablePage = () => {
  const [flatData, setFlatData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [editedData, setEditedData] = useState({
    name: "",
    description: "",
  });

  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {
    const loadFullHierarchy = async () => {
      try {
        setLoading(true);

        const parentRes = await getParents();
        const parentsData = parentRes.data;

        let completeList = [];

        for (const parent of parentsData) {
          completeList.push({
            ...parent,
            level: 1,
          });

          const childRes = await getCapabilities(parent.id);

          for (const child of childRes.data) {
            completeList.push({
              ...child,
              level: 2,
            });

            const grandRes = await getCapabilities(child.id);

            for (const grand of grandRes.data) {
              completeList.push({
                ...grand,
                level: 3,
              });
            }
          }
        }

        setFlatData(completeList);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFullHierarchy();
  }, []);

  // =====================================
  // EDIT
  // =====================================

  const handleEdit = (item) => {
    setEditingId(item.id);

    setEditedData({
      name: item.name || "",
      description: item.description || "",
    });
  };

  // =====================================
  // INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // SAVE
  // =====================================

  const handleSave = async (id) => {
    try {
      await updateCapability(id, editedData);

      setFlatData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: editedData.name,
                description: editedData.description,
              }
            : item
        )
      );

      setEditingId(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // =====================================
  // CANCEL
  // =====================================

  const handleCancel = () => {
    setEditingId(null);
  };

  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm("Delete this capability?");

    if (!confirmDelete) return;

    try {
      await deleteCapability(id);

      setFlatData((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* HEADER */}
      <Header />

      {/* MAIN PAGE */}
      <main className="main-content">
        {/* PAGE TITLE */}
        <section className="table-header-section">
          <h1>Capability Table</h1>

          <p>
            Structured Business Architecture
            Repository
          </p>
        </section>

        {/* TABLE */}
        <section className="table-wrapper">
          {loading ? (
            <div className="loader">
              Organizing Grid...
            </div>
          ) : (
            <table className="grid-table">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Capability Name</th>

                  <th>Description</th>

                  <th>Maturity</th>

                  <th>Layer</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {flatData.map((item) => (
                  <tr
                    key={item.id}
                    className={`row-lvl-${item.level}`}
                  >
                    {/* ID */}
                    <td className="id-cell">
                      {item.id}
                    </td>

                    {/* NAME */}
                    <td className="name-column">
                      <div
                        className="name-wrapper"
                        style={{
                          paddingLeft: `${
                            (item.level - 1) * 28
                          }px`,
                        }}
                      >
                        <span
                          className={`status-dot m${item.maturity_level}`}
                        ></span>

                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="name"
                            value={editedData.name}
                            onChange={handleChange}
                            className="edit-input"
                          />
                        ) : (
                          <span
                            className={`capability-name lvl-${item.level}`}
                          >
                            {item.name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* DESCRIPTION */}
                    <td className="description-cell">
                      {editingId === item.id ? (
                        <textarea
                          name="description"
                          value={
                            editedData.description
                          }
                          onChange={handleChange}
                          className="edit-textarea"
                        />
                      ) : (
                        item.description ||
                        "insert description"
                      )}
                    </td>

                    {/* MATURITY */}
                    <td>
                      <span
                        className={`maturity-tag m${item.maturity_level}`}
                      >
                        Level{" "}
                        {item.maturity_level || 1}
                      </span>
                    </td>

                    {/* LAYER */}
                    <td>
                      <span
                        className={`layer-tag l${item.level}`}
                      >
                        Layer {item.level}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="action-buttons">
                      {editingId === item.id ? (
                        <>
                          <button
                            className="save-btn"
                            onClick={() =>
                              handleSave(item.id)
                            }
                          >
                            <FaSave />
                          </button>

                          <button
                            className="cancel-btn"
                            onClick={handleCancel}
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(item)
                          }
                        >
                          <FaEdit />
                        </button>
                      )}

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default TablePage;
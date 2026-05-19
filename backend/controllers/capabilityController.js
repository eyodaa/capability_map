
const db = require("../db");

exports.getParents = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM capabilities WHERE parent_id IS NULL"
    );
    res.json(result);
  } catch (err) {
    console.error("Error fetching parents:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCapabilities = async (req, res) => {
  try {
    const parentId = req.params.parentId;

    if (!parentId) {
      return res.status(400).json({ error: "parentId is missing" });
    }

    const [result] = await db.query(
      "SELECT * FROM capabilities WHERE parent_id = ?",
      [parentId]
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching capabilities:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCapability = async (req, res) => {
  try {
    const id = req.params.id;
    const { name,description, maturity_level } = req.body;

    const [result] = await db.query(
      `UPDATE capabilities SET name = ?, description = ?, maturity_level = ? WHERE id = ?`,
      [name,description, maturity_level, id]
    );

    res.json({
      message: "Capability updated",
      result
    });

  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json(err);
  }
};

exports.saveAll = async (req, res) => {
  const { capabilities } = req.body;

  try {
    for (const cap of capabilities) {
      const mLevel = parseInt(cap.maturity_level, 10);

      await db.query(
  "UPDATE capabilities SET name = ?, maturity_level = ?, description = ? WHERE id = ?",
  [cap.name, mLevel, cap.description || "", cap.id]
);
    }

    res.status(200).json({ message: "Database updated successfully!" });

  } catch (error) {
    console.error("Critical Save Error:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.createCapabilityTree = async (req, res) => {
  console.log("REQ BODY:", req.body);

  const capabilities = req.body;

  if (!Array.isArray(capabilities)) {
    return res.status(400).json({ error: "Expected an array" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (const cap of capabilities) {
      const { id, name, description, maturity_level, parent_id } = cap;

      if (!id || !name) {
        throw new Error("ID and Name are required");
      }

      await connection.query(
        `INSERT INTO capabilities 
        (id, name, description, maturity_level, parent_id) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          id,
          name,
          description || "",
          maturity_level || 1,
          parent_id || null
        ]
      );
    }

    await connection.commit();

    res.json({ message: "Tree created successfully ✅" });

  } catch (err) {
    await connection.rollback();
    console.error("Tree creation error FULL:", err);

    res.status(500).json({
      error: err.message,
      hint: "Check for duplicate IDs or invalid parent_id"
    });
  } finally {
    connection.release();
  }
};
exports.deleteCapability = async (req, res) => {

  try {

    const id = req.params.id;

    const sql = `
      DELETE FROM capabilities
      WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

      if (err) {

        console.error(err);

        return res.status(500).json({
          error: err.message
        });

      }

      res.json({
        message: "Capability deleted successfully"
      });

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

};
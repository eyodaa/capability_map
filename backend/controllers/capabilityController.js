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
    const { description, maturity_level } = req.body;

    const [result] = await db.query(
      `UPDATE capabilities SET description = ?, maturity_level = ? WHERE id = ?`,
      [description, maturity_level, id]
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
        "UPDATE capabilities SET maturity_level = ? WHERE id = ?",
        [mLevel, cap.id]
      );
    }

    res.status(200).json({ message: "Database updated successfully!" });

  } catch (error) {
    console.error("Critical Save Error:", error);
    res.status(500).json({ error: error.message });
  }
};
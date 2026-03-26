/*const db = require("../db");

exports.getParents = async (req, res) => {
  const sql = "SELECT * FROM capabilities WHERE parent_id IS NULL";

  try {
    const [result] = await db.promise().query(sql);
    res.json(result);
  } catch (err) {
    console.error("Error fetching parents:", err);
    res.status(500).json(err);
  }
};

exports.getCapabilities = async (req, res) => {
  const parentId = req.params.parentId;
  const sql = "SELECT * FROM capabilities WHERE parent_id = ?";

  try {
    // We 'await' the result so the response isn't sent until the data is ready
    const [result] = await db.promise().query(sql, [parentId]);
    res.json(result);
  } catch (err) {
    console.error("Error fetching capabilities:", err);
    res.status(500).json(err);
  }
};
exports.updateCapability =  (req, res) => {

  const id = req.params.id;
  const { description, maturity_level } = req.body;

  const sql = `
    UPDATE capabilities
    SET description = ?, maturity_level = ?
    WHERE id = ?
  `;

  db.query(sql, [description, maturity_level, id], (err, result) => {

    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    console.log("Rows affected:", result.affectedRows);
   //this is the updated code 
    //await updateParentHierarchy(id);
//till this

    res.json({
      message: "Capability updated",
      result
    });

  });

};
// controllers/capabilityController.js

// In capabilityController.js

exports.saveAll = async (req, res) => {
  const { capabilities } = req.body;
  
  // Create a promise-ready version of your db object
  const promiseDb = db.promise();

  try {
    console.log(`Starting update for ${capabilities.length} items...`);

    // We use a loop to ensure every single item is updated individually
    for (const cap of capabilities) {
      
      // 1. Force convert maturity_level to a Number to be safe
    const mLevel = parseInt(cap.maturity_level, 10);
      // 2. Run the update directly
      const [result] = await promiseDb.query(
        "UPDATE capabilities SET maturity_level = ? WHERE id = ?",
        [mLevel, cap.id]
      );
      
      console.log(`ID: ${cap.id} | Level: ${mLevel} | Rows Matched: ${result.affectedRows}`);
    }

    // Since we aren't using an explicit Transaction anymore, 
    // MySQL handles the 'commit' automatically for each query.
    res.status(200).json({ message: "Database updated successfully!" });

  } catch (error) {
    console.error("Critical Save Error:", error);
    res.status(500).json({ error: "Failed to save to database", details: error.message });
  }
};*/
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
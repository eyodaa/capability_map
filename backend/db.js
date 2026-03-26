const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "rootpassword",
    database: "capability_db",
    port: 3307
});

// Optional test connection
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("Connected to MySQL Database");
        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err);
    }
})();

module.exports = db;
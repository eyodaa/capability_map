const express = require("express");
const cors = require("cors");

const capabilityRoutes = require("./routes/capabilities");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES

app.use("/api", capabilityRoutes);
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

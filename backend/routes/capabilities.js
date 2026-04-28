const express = require("express");
const router = express.Router();

const capabilityController = require("../controllers/capabilityController");

router.post("/capabilities/save-all", capabilityController.saveAll);
router.get("/parents", capabilityController.getParents);
router.get("/capabilities/:parentId", capabilityController.getCapabilities);
router.put("/capabilities/:id", capabilityController.updateCapability); 
router.post("/create", capabilityController.createCapability);
module.exports = router;
const express = require("express");
const router = express.Router();

const capabilityController = require("../controllers/capabilityController");

router.post("/create-tree", capabilityController.createCapabilityTree);
router.post("/capabilities/save-all", capabilityController.saveAll);
router.get("/parents", capabilityController.getParents);
router.get("/capabilities/:parentId", capabilityController.getCapabilities);
router.put("/capabilities/:id", capabilityController.updateCapability); 
router.delete("/capabilities/:id", capabilityController.deleteCapability);
module.exports = router;
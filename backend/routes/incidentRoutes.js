
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const sseController = require("../controllers/sseController");

const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident
} = require("../controllers/incidentController");

// SSE streaming route
router.get("/stream", auth, sseController.subscribe);

router.post("/",auth,createIncident);
router.get("/",auth,getIncidents);
router.get("/:id",auth,getIncidentById);
router.put("/:id",auth,updateIncident);
router.delete("/:id",auth,deleteIncident);

module.exports = router;

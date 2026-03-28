const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getAppointments,
  updateStatus
} = require("../controllers/appointmentController");

router.post("/", bookAppointment);
router.get("/", getAppointments);
router.put("/:id", updateStatus);

module.exports = router;
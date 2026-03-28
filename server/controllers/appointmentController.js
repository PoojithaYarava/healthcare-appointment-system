const Appointment = require("../models/Appointment");

// Book Appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time
    });

    await appointment.save();

    res.json({ message: "Appointment booked successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name email");

    res.json(appointments);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(appointment);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
import mongoose from "mongoose";
import appointmentModel from "../models/AppointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";

const bookAppointment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ success: false, message: "Missing booking details" });
        }

        const userData = await userModel.findById(userId).select("-password").session(session);
        if (!userData) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const docData = await doctorModel
            .findById(docId)
            .select("-password")
            .populate("hospitalId", "name location image verified")
            .session(session);

        if (!docData || !docData.available) {
            await session.abortTransaction();
            session.endSession();
            return res.json({ success: false, message: "Doctor not available" });
        }

        const slotsBooked = docData.slots_booked || {};
        if (slotsBooked[slotDate] && slotsBooked[slotDate].includes(slotTime)) {
            await session.abortTransaction();
            session.endSession();
            return res.json({ success: false, message: "Slot already taken" });
        }

        if (!slotsBooked[slotDate]) {
            slotsBooked[slotDate] = [];
        }
        slotsBooked[slotDate].push(slotTime);

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save({ session });

        docData.slots_booked = slotsBooked;
        docData.markModified("slots_booked");
        await docData.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, message: "Appointment booked successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        res.status(500).json({ success: false, message: "Booking failed. Please try again." });
    }
};

const getUserAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const confirmAppointmentPayment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required" });
        }

        const appointment = await appointmentModel.findOne({ _id: appointmentId, userId });

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        appointment.payment = true;
        await appointment.save();

        res.json({ success: true, message: "Payment confirmed successfully", appointment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { bookAppointment, getUserAppointments, confirmAppointmentPayment };

import mongoose from "mongoose";
import appointmentModel from "../models/AppointmentModel.js";
import doctorModel from "../models/doctorModel.js";

const bookAppointment = async (req, res) => {
    // 1. Start a Session for the Transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        // 2. Use the session for the initial find
        const docData = await doctorModel.findById(docId).session(session);

        if (!docData || !docData.available) {
            await session.abortTransaction();
            return res.json({ success: false, message: "Doctor not available" });
        }

        let slots_booked = docData.slots_booked || {};

        // 3. Logic check for availability
        if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
            await session.abortTransaction();
            return res.json({ success: false, message: "Slot already taken" });
        }

        // 4. Update the local object
        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = [];
        }
        slots_booked[slotDate].push(slotTime);

        // 5. Create Appointment (linked to session)
        const appointmentData = {
            userId,
            docId,
            docData, // Consider only saving essential doc info to save space
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save({ session });

        // 6. Update Doctor (linked to session)
        // Mark 'slots_booked' as modified if it's a Mixed type in Mongoose
        docData.slots_booked = slots_booked;
        docData.markModified('slots_booked'); 
        await docData.save({ session });

        // 7. Commit everything at once
        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, message: "Appointment Booked Successfully ✅" });

    } catch (error) {
        // If anything fails, undo all changes
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        res.json({ success: false, message: "Booking failed. Please try again." });
    }
};

export { bookAppointment };
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import appointmentModel from '../models/AppointmentModel.js';
import doctorModel from '../models/doctorModel.js';

const createDoctorToken = (id) => jwt.sign(
    { id: String(id), role: 'doctor' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

const findDoctorByEmail = (email) => doctorModel.findOne({
    email: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
});

const sanitizeDoctor = (doctor) => {
    const doctorObject = doctor.toObject ? doctor.toObject() : doctor;
    const { password, slots_booked, ...safeDoctor } = doctorObject;
    return safeDoctor;
};

const getApprovalMessage = (doctor) => {
    if (doctor.registrationStatus === 'rejected') {
        return "Your doctor account request was rejected. Please contact the admin team.";
    }

    return "Your doctor account is pending admin approval.";
};

const parseAddress = (address) => {
    if (!address) {
        return { line1: '', line2: '' };
    }

    if (typeof address === 'object') {
        return address;
    }

    try {
        return JSON.parse(address);
    } catch {
        return { line1: address, line2: '' };
    }
};

const registerDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            hospitalId
        } = req.body;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
            return res.json({ success: false, message: "Missing doctor details" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingDoctor = await findDoctorByEmail(normalizedEmail);
        if (existingDoctor) {
            return res.json({ success: false, message: "Doctor already exists" });
        }

        if (!validator.isEmail(normalizedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const doctor = await doctorModel.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            isApproved: false,
            registrationStatus: 'pending',
            registrationSource: 'self',
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: parseAddress(address),
            hospitalId: hospitalId || null,
            date: Date.now()
        });

        res.json({
            success: true,
            requiresApproval: true,
            message: "Registration submitted successfully. Wait for admin approval before logging in.",
            doctor: sanitizeDoctor(doctor)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const doctor = await findDoctorByEmail(normalizedEmail);

        if (!doctor) {
            return res.json({ success: false, message: "Doctor does not exist" });
        }

        if (doctor.isApproved === false) {
            return res.status(403).json({
                success: false,
                requiresApproval: true,
                message: getApprovalMessage(doctor)
            });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createDoctorToken(doctor._id);
        res.json({ success: true, token, role: 'doctor', doctor: sanitizeDoctor(doctor) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await doctorModel
            .findById(req.doctorId)
            .select('-password -slots_booked')
            .populate('hospitalId', 'name location image verified');

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel
            .find({ docId: req.doctorId })
            .sort({ date: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { appointmentId, action } = req.body;

        if (!appointmentId || !action) {
            return res.status(400).json({ success: false, message: "Appointment ID and action are required" });
        }

        const appointment = await appointmentModel.findOne({ _id: appointmentId, docId: req.doctorId });
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.cancelled) {
            return res.status(400).json({ success: false, message: "Cancelled appointments cannot be updated" });
        }

        if (action === 'approve') {
            if (appointment.doctorApproved) {
                return res.json({ success: true, message: "Appointment already approved", appointment });
            }

            appointment.doctorApproved = true;
            await appointment.save();
            return res.json({ success: true, message: "Appointment approved successfully", appointment });
        }

        if (action === 'confirm') {
            if (!appointment.doctorApproved) {
                return res.status(400).json({ success: false, message: "Approve the appointment before confirming it" });
            }

            appointment.isCompleted = true;
            await appointment.save();
            return res.json({ success: true, message: "Appointment confirmed successfully", appointment });
        }

        return res.status(400).json({ success: false, message: "Unsupported action" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateTelemedicineLink = async (req, res) => {
    try {
        const { appointmentId, consultationLink } = req.body;

        if (!appointmentId || !consultationLink) {
            return res.status(400).json({ success: false, message: "Appointment ID and consultation link are required" });
        }

        let parsedUrl;
        try {
            parsedUrl = new URL(consultationLink);
        } catch {
            return res.status(400).json({ success: false, message: "Please provide a valid meeting URL" });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({ success: false, message: "Meeting URL must start with http or https" });
        }

        const appointment = await appointmentModel.findOne({ _id: appointmentId, docId: req.doctorId });
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        if (appointment.appointmentMode !== "telemedicine") {
            return res.status(400).json({ success: false, message: "Consultation links can only be added to telemedicine appointments" });
        }

        appointment.consultationLink = consultationLink.trim();
        await appointment.save();

        return res.json({ success: true, message: "Consultation link saved successfully", appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registerDoctor,
    loginDoctor,
    getDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus,
    updateTelemedicineLink
};

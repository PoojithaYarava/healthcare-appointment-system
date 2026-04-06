import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import hospitalModel from "../models/hospitalModel.js";

const addHospital = async (req, res) => {
    try {
        const { name, location, description, image } = req.body;

        if (!name || !location || !image) {
            return res.json({ success: false, message: "Missing hospital details" });
        }

        const hospital = new hospitalModel({
            name,
            location,
            description,
            image
        });

        await hospital.save();

        res.json({ success: true, message: "Hospital added successfully", hospital });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to add doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address, hospitalId } = req.body;
        const imageFile = req.file;
        const normalizedEmail = email?.trim().toLowerCase();

        // Checking for all data to add doctor
        if (!name || !normalizedEmail || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validating email format
        if (!validator.isEmail(normalizedEmail)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            isApproved: true,
            registrationStatus: 'approved',
            registrationSource: 'admin',
            hospitalId: hospitalId || null,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            image: imageUrl,
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor Added Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listPendingDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({ registrationStatus: 'pending' })
            .select('-password -slots_booked')
            .populate('hospitalId', 'name location image verified')
            .sort({ date: -1 });

        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({})
            .select('-password -slots_booked')
            .populate('hospitalId', 'name location image verified')
            .sort({ date: -1 });

        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listHospitals = async (req, res) => {
    try {
        const hospitals = await hospitalModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, hospitals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateDoctorApprovalStatus = async (req, res) => {
    try {
        const { doctorId, action } = req.body;

        if (!doctorId || !action) {
            return res.status(400).json({ success: false, message: "Doctor ID and action are required" });
        }

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        if (action === 'approve') {
            doctor.isApproved = true;
            doctor.registrationStatus = 'approved';
            await doctor.save();
            return res.json({ success: true, message: "Doctor approved successfully", doctor });
        }

        if (action === 'reject') {
            doctor.isApproved = false;
            doctor.registrationStatus = 'rejected';
            await doctor.save();
            return res.json({ success: true, message: "Doctor rejected successfully", doctor });
        }

        return res.status(400).json({ success: false, message: "Unsupported action" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addDoctor, addHospital, listPendingDoctors, listDoctors, listHospitals, updateDoctorApprovalStatus };

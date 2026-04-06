import doctorModel from "../models/doctorModel.js";
import hospitalModel from "../models/hospitalModel.js";
import labTestModel from "../models/LabTestModel.js";

const listDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({
                available: true,
                $or: [
                    { isApproved: true },
                    { isApproved: { $exists: false } }
                ]
            })
            .select("-password -slots_booked")
            .populate("hospitalId", "name location image verified")
            .sort({ createdAt: -1, date: -1 });

        res.json({ success: true, doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const { docId } = req.params;

        const doctor = await doctorModel
            .findById(docId)
            .select("-password")
            .populate("hospitalId", "name location image verified");

        if (!doctor || doctor.isApproved === false) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, doctor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listHospitals = async (req, res) => {
    try {
        const hospitals = await hospitalModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, hospitals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listLabTests = async (req, res) => {
    try {
        const labTests = await labTestModel.find({ active: true }).sort({ createdAt: -1 });
        res.json({ success: true, labTests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getLabTestById = async (req, res) => {
    try {
        const { testId } = req.params;
        const labTest = await labTestModel.findOne({ _id: testId, active: true });

        if (!labTest) {
            return res.status(404).json({ success: false, message: "Lab test not found" });
        }

        res.json({ success: true, labTest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { listDoctors, getDoctorById, listHospitals, listLabTests, getLabTestById };

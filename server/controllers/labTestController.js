import labTestModel from "../models/LabTestModel.js";
import labTestBookingModel from "../models/LabTestBookingModel.js";
import userModel from "../models/userModel.js";

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

const bookLabTest = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            testId,
            patientName,
            patientAge,
            gender,
            phone,
            alternatePhone,
            addressLine1,
            addressLine2,
            landmark,
            preferredDate,
            preferredTime,
            notes,
            collectionInstructions
        } = req.body;

        if (!testId || !patientName || !patientAge || !gender || !phone || !addressLine1 || !preferredDate || !preferredTime) {
            return res.status(400).json({ success: false, message: "Missing booking details" });
        }

        const [userData, testData] = await Promise.all([
            userModel.findById(userId).select("-password"),
            labTestModel.findOne({ _id: testId, active: true })
        ]);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!testData) {
            return res.status(404).json({ success: false, message: "Lab test not found" });
        }

        const booking = await labTestBookingModel.create({
            userId,
            testId,
            testData,
            userData,
            patientName,
            patientAge,
            gender,
            phone,
            alternatePhone: alternatePhone || "",
            address: {
                line1: addressLine1,
                line2: addressLine2 || ""
            },
            landmark: landmark || "",
            preferredDate,
            preferredTime,
            notes: notes || "",
            collectionInstructions: collectionInstructions || "",
            amount: testData.price,
            date: Date.now()
        });

        res.json({ success: true, message: "Home sample collection booked successfully", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to book lab test right now" });
    }
};

const getUserLabBookings = async (req, res) => {
    try {
        const bookings = await labTestBookingModel.find({ userId: req.userId }).sort({ date: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const addLabTest = async (req, res) => {
    try {
        const { name, category, sampleType, reportTime, price, description, preparations, image } = req.body;

        if (!name || !category || !sampleType || !reportTime || !price || !description) {
            return res.status(400).json({ success: false, message: "Missing lab test details" });
        }

        await labTestModel.create({
            name,
            category,
            sampleType,
            reportTime,
            price,
            description,
            preparations,
            image
        });

        res.json({ success: true, message: "Lab test added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listAllLabTests = async (req, res) => {
    try {
        const labTests = await labTestModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, labTests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const listAllLabBookings = async (req, res) => {
    try {
        const bookings = await labTestBookingModel.find({}).sort({ date: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateLabBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;
        const validStatuses = ["requested", "sample-collected", "processing", "report-ready", "cancelled"];

        if (!bookingId || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid booking status update" });
        }

        const booking = await labTestBookingModel.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Lab booking not found" });
        }

        res.json({ success: true, message: "Lab booking status updated", booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    listLabTests,
    getLabTestById,
    bookLabTest,
    getUserLabBookings,
    addLabTest,
    listAllLabTests,
    listAllLabBookings,
    updateLabBookingStatus
};

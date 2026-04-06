import mongoose from "mongoose";

const labTestBookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    testId: { type: String, required: true },
    testData: { type: Object, required: true },
    userData: { type: Object, required: true },
    patientName: { type: String, required: true, trim: true },
    patientAge: { type: String, default: "", trim: true },
    gender: { type: String, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, default: "", trim: true },
    address: {
        line1: { type: String, required: true, trim: true },
        line2: { type: String, default: "", trim: true }
    },
    landmark: { type: String, default: "", trim: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    notes: { type: String, default: "", trim: true },
    collectionInstructions: { type: String, default: "", trim: true },
    collectionType: { type: String, default: "home" },
    amount: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["requested", "sample-collected", "processing", "report-ready", "cancelled"],
        default: "requested"
    },
    date: { type: Number, required: true }
}, { timestamps: true });

const labTestBookingModel = mongoose.models.labTestBooking || mongoose.model("labTestBooking", labTestBookingSchema);

export default labTestBookingModel;

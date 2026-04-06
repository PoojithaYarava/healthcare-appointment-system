import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    sampleType: { type: String, required: true, trim: true },
    reportTime: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    preparations: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    homeCollection: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const labTestModel = mongoose.models.labTest || mongoose.model("labTest", labTestSchema);

export default labTestModel;

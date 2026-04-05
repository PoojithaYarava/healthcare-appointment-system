import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
    verified: { type: Boolean, default: true }
}, { timestamps: true });

const hospitalModel = mongoose.models.hospital || mongoose.model("hospital", hospitalSchema);

export default hospitalModel;

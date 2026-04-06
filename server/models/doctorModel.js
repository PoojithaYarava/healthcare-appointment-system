import mongoose from "mongoose";

const defaultDoctorImage = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <rect width="200" height="200" rx="28" fill="#e0f2fe"/>
    <circle cx="100" cy="72" r="36" fill="#0ea5e9"/>
    <path d="M42 166c12-26 34-42 58-42s46 16 58 42" fill="#0284c7"/>
  </svg>
`)}`;

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: defaultDoctorImage },
    isApproved: { type: Boolean, default: false },
    registrationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    registrationSource: { type: String, enum: ['self', 'admin'], default: 'self' },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'hospital', default: null },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} }
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema);

export default doctorModel;

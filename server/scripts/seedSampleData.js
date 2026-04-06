import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import hospitalModel from "../models/hospitalModel.js";
import doctorModel from "../models/doctorModel.js";
import labTestModel from "../models/LabTestModel.js";

const sampleHospitals = [
    {
        name: "Sunrise Medical Center",
        location: "Bengaluru, Karnataka",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
        description: "Multi-specialty care with strong outpatient and diagnostics support."
    },
    {
        name: "Green Valley Hospital",
        location: "Hyderabad, Telangana",
        image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
        description: "A large urban hospital focused on cardiology, neurology, and emergency care."
    },
    {
        name: "CityCare Multispeciality",
        location: "Chennai, Tamil Nadu",
        image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=900&q=80",
        description: "Specialized consultations and modern imaging facilities for families and professionals."
    }
];

const sampleDoctors = [
    {
        name: "Dr. Amelia Carter",
        email: "amelia.carter@mediconnect.demo",
        password: "Doctor@123",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
        speciality: "Cardiologist",
        degree: "MBBS, MD",
        experience: "12 Years",
        about: "Experienced in preventive cardiology, cardiac imaging, and long-term heart health management.",
        fees: 800,
        address: { line1: "Sunrise Medical Center", line2: "Bengaluru, Karnataka" },
        hospitalName: "Sunrise Medical Center"
    },
    {
        name: "Dr. Ethan Brooks",
        email: "ethan.brooks@mediconnect.demo",
        password: "Doctor@123",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
        speciality: "Dermatologist",
        degree: "MBBS, DDVL",
        experience: "9 Years",
        about: "Focuses on clinical dermatology, acne management, and non-invasive skin treatment plans.",
        fees: 650,
        address: { line1: "CityCare Multispeciality", line2: "Chennai, Tamil Nadu" },
        hospitalName: "CityCare Multispeciality"
    },
    {
        name: "Dr. Sophia Nguyen",
        email: "sophia.nguyen@mediconnect.demo",
        password: "Doctor@123",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",
        speciality: "Neurologist",
        degree: "MBBS, DM",
        experience: "14 Years",
        about: "Treats migraines, seizure disorders, and complex neurological conditions with patient-first care.",
        fees: 1000,
        address: { line1: "Green Valley Hospital", line2: "Hyderabad, Telangana" },
        hospitalName: "Green Valley Hospital"
    },
    {
        name: "Dr. Mason Patel",
        email: "mason.patel@mediconnect.demo",
        password: "Doctor@123",
        image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80",
        speciality: "Pediatrician",
        degree: "MBBS, DCH",
        experience: "10 Years",
        about: "Provides routine child wellness care, immunization guidance, and family-centered pediatric support.",
        fees: 500,
        address: { line1: "Sunrise Medical Center", line2: "Bengaluru, Karnataka" },
        hospitalName: "Sunrise Medical Center"
    }
];

const sampleLabTests = [
    {
        name: "Complete Blood Count (CBC)",
        category: "Routine Health",
        sampleType: "Blood Sample",
        reportTime: "Within 12 hours",
        price: 499,
        description: "A common screening test that evaluates red cells, white cells, hemoglobin, and platelets.",
        preparations: "No fasting required. Stay hydrated before sample collection.",
        image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80"
    },
    {
        name: "Thyroid Profile (T3, T4, TSH)",
        category: "Hormonal Health",
        sampleType: "Blood Sample",
        reportTime: "Same day evening",
        price: 799,
        description: "Checks thyroid hormone levels to support diagnosis of hypo- or hyperthyroidism.",
        preparations: "Morning collection preferred. Inform the team about ongoing thyroid medication.",
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80"
    },
    {
        name: "Diabetes Screening (HbA1c + Fasting Sugar)",
        category: "Diabetes Care",
        sampleType: "Blood Sample",
        reportTime: "Within 24 hours",
        price: 899,
        description: "Useful for screening and ongoing monitoring of blood sugar control over time.",
        preparations: "Fast for 8 to 10 hours before collection unless advised otherwise by your doctor.",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await hospitalModel.deleteMany({});
        await doctorModel.deleteMany({});
        await labTestModel.deleteMany({});

        const hospitals = await hospitalModel.insertMany(sampleHospitals);
        const hospitalMap = new Map(hospitals.map((hospital) => [hospital.name, hospital._id]));

        const doctorsWithHashes = await Promise.all(sampleDoctors.map(async (doctor) => ({
            ...doctor,
            hospitalId: hospitalMap.get(doctor.hospitalName) || null,
            password: await bcrypt.hash(doctor.password, 10),
            isApproved: true,
            registrationStatus: 'approved',
            registrationSource: 'admin',
            date: Date.now()
        })));

        const doctorsToInsert = doctorsWithHashes.map(({ hospitalName, ...doctor }) => doctor);
        await doctorModel.insertMany(doctorsToInsert);
        await labTestModel.insertMany(sampleLabTests);

        console.log("Sample hospitals, doctors, and lab tests seeded successfully.");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seed();

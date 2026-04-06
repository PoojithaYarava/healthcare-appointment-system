import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";
import labTestModel from "../models/LabTestModel.js";

const defaultLabTests = [
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
    },
    {
        name: "Vitamin D and B12 Panel",
        category: "Nutrition",
        sampleType: "Blood Sample",
        reportTime: "Within 24 hours",
        price: 1499,
        description: "Measures common vitamin deficiencies linked to fatigue, weakness, and low immunity.",
        preparations: "No special preparation needed for home sample collection.",
        image: "https://images.unsplash.com/photo-1580281657527-47fa9f08f4df?auto=format&fit=crop&w=900&q=80"
    }
];

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Database Connected Successfully");
    });

    mongoose.connection.on('error', (err) => {
        console.log("Database Connection Error:", err);
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);

        // Backfill older doctors so legacy admin/seeded records remain approved
        await doctorModel.updateMany(
            { isApproved: { $exists: false } },
            {
                $set: {
                    isApproved: true,
                    registrationStatus: 'approved',
                    registrationSource: 'admin'
                }
            }
        );

        const labTestCount = await labTestModel.countDocuments();
        if (!labTestCount) {
            await labTestModel.insertMany(defaultLabTests);
            console.log("Default lab tests seeded successfully");
        }
    } catch (error) {
        console.log("Initial Connection Failed:", error.message);
    }
};

export default connectDB;

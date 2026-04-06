import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { v2 as cloudinary } from "cloudinary";

// Helper: Create a 7-day token with explicit 'id' key
const createToken = (id) => {
    // Convert to string to ensure consistency in the JWT payload
    return jwt.sign({ id: String(id), role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// API for User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API for User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get User Profile Data
export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        
        const userData = await userModel.findById(userId).select('-password');
        
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update User Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Parse address if it comes as a string from FormData
        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (e) {
                console.log("Address parsing handled");
            }
        }

        await userModel.findByIdAndUpdate(userId, { 
            name, 
            phone, 
            address: parsedAddress, 
            dob, 
            gender 
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
        }

        res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

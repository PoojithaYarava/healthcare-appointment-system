import express from 'express';
import { registerUser, loginUser, updateProfile, getProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Route to get profile (The one currently causing your 404)
userRouter.get('/get-profile', authUser, getProfile);

// Route to update profile (Uses POST because we are sending a file)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);

export default userRouter;
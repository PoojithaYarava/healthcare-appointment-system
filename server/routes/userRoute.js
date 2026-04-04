import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);

// This MUST be .get to match axios.get in your AppContext
userRouter.get('/get-profile', authUser, getProfile);


export default userRouter;
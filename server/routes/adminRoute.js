import express from 'express';
import { addDoctor, addHospital } from '../controllers/adminController.js';
import upload from '../middlewares/multer.js'; // You will need to create this for image handling

const adminRouter = express.Router();

adminRouter.post('/add-hospital', addHospital);
adminRouter.post('/add-doctor', upload.single('image'), addDoctor);

export default adminRouter;

import express from 'express';
import { addDoctor, addHospital, listPendingDoctors, listDoctors, listHospitals, updateDoctorApprovalStatus } from '../controllers/adminController.js';
import { getAdminProfile, loginAdmin } from '../controllers/adminAuthController.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js'; // You will need to create this for image handling

const adminRouter = express.Router();

adminRouter.post('/login', loginAdmin);
adminRouter.get('/profile', authAdmin, getAdminProfile);
adminRouter.post('/add-hospital', authAdmin, addHospital);
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.get('/pending-doctors', authAdmin, listPendingDoctors);
adminRouter.get('/doctors', authAdmin, listDoctors);
adminRouter.get('/hospitals', authAdmin, listHospitals);
adminRouter.post('/update-doctor-status', authAdmin, updateDoctorApprovalStatus);

export default adminRouter;

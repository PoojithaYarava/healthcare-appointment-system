import express from 'express';
import { addDoctor, addHospital, listPendingDoctors, listDoctors, listHospitals, updateDoctorApprovalStatus } from '../controllers/adminController.js';
import { getAdminProfile, loginAdmin } from '../controllers/adminAuthController.js';
import authAdmin from '../middlewares/authAdmin.js';
import { addLabTest, listAllLabBookings, listAllLabTests, updateLabBookingStatus } from '../controllers/labTestController.js';
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
adminRouter.post('/add-lab-test', authAdmin, addLabTest);
adminRouter.get('/lab-tests', authAdmin, listAllLabTests);
adminRouter.get('/lab-bookings', authAdmin, listAllLabBookings);
adminRouter.post('/update-lab-booking-status', authAdmin, updateLabBookingStatus);

export default adminRouter;

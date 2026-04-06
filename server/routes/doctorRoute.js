import express from 'express';
import authDoctor from '../middlewares/authDoctor.js';
import {
    registerDoctor,
    loginDoctor,
    getDoctorProfile,
    getDoctorAppointments,
    updateAppointmentStatus
} from '../controllers/doctorController.js';

const doctorRouter = express.Router();

doctorRouter.post('/register', registerDoctor);
doctorRouter.post('/login', loginDoctor);
doctorRouter.get('/get-profile', authDoctor, getDoctorProfile);
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments);
doctorRouter.post('/appointments/update-status', authDoctor, updateAppointmentStatus);

export default doctorRouter;

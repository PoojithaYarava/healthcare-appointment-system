import express from "express";
import { getDoctorById, listDoctors, listHospitals } from "../controllers/publicController.js";

const publicRouter = express.Router();

publicRouter.get("/doctors", listDoctors);
publicRouter.get("/doctors/:docId", getDoctorById);
publicRouter.get("/hospitals", listHospitals);

export default publicRouter;

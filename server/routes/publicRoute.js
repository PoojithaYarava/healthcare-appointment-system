import express from "express";
import { getDoctorById, getLabTestById, listDoctors, listHospitals, listLabTests } from "../controllers/publicController.js";

const publicRouter = express.Router();

publicRouter.get("/doctors", listDoctors);
publicRouter.get("/doctors/:docId", getDoctorById);
publicRouter.get("/hospitals", listHospitals);
publicRouter.get("/lab-tests", listLabTests);
publicRouter.get("/lab-tests/:testId", getLabTestById);

export default publicRouter;

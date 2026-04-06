import express from "express";
import authUser from "../middlewares/authUser.js";
import {
    bookLabTest,
    getUserLabBookings
} from "../controllers/labTestController.js";

const labTestRouter = express.Router();

labTestRouter.post("/book", authUser, bookLabTest);
labTestRouter.get("/my-bookings", authUser, getUserLabBookings);

export default labTestRouter;

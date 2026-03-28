const express = require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config();

const app = express();


//middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection
// mongoose.connect("mongodb://127.0.0.1:27017/mediconnect")
// .then(()=> console.log("MongoDB connected"))
// .catch(err => console.log(err));

//routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");


app.use("/api/auth",authRoutes);
app.use("/api/appointments",appointmentRoutes);

//DB Connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("DB Connected"))
.catch(err => console.log(err));

//test route
app.get("/",(req,res)=>{
  res.send("API running");
});

//server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
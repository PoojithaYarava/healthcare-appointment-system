const express = require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection
mongoose.connect("mongodb+srv://yaravapoojitha_db_user:Poojitha_003@healthcare-cluster.ng6kkur.mongodb.net/healthcare?retryWrites=true&w=majority")
.then(()=> console.log("MongoDB connected"))
.catch(err => console.log(err));

//routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth",authRoutes);

//test route
app.get("/",(req,res)=>{
  res.send("API running");
});

//server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
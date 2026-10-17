const express=require("express"),mongoose=require("mongoose"),cors=require("cors");require("dotenv").config();

const app=express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>res.json({message:"EcoTrack Backend is running"}));

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/requests",require("./routes/requestRoutes"));
app.use("/api/schedules",require("./routes/scheduleRoutes"));
app.use("/api/complaints",require("./routes/complaintRoutes"));
app.use("/api/recycling",require("./routes/recyclingRoutes"));
app.use("/api/collectors",require("./routes/collectorRoutes"));
app.use("/api/dashboard",require("./routes/dashboardRoutes"));
mongoose.connect(process.env.MONGO_URI).then(()=>{console.log("MongoDB connected successfully");
app.listen(process.env.PORT||5000,()=>console.log(`Server running on http://localhost:${process.env.PORT||5000}`))}).catch(e=>{console.error(e);process.exit(1)});
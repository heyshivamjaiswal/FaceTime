import express from "express";
import dotenv from  "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./Routes/auth.js"
import userRoutes from "./Routes/userRoute.js"
import chatRoutes from "./Routes/chatRoute.js"

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL
        credentials: true,  
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT , ()=>{
    console.log(`Server is running on ${PORT}`)
    connectDB()
});    
import express from "express"
import dotenv from "dotenv"
import authRouter from "./src/routes/auth.routes.js";
import { connectDb } from "./src/lib/db.connect.js";
import cookieParser from "cookie-parser";
import messageRouter from "./src/routes/message.routes.js";
import cors from "cors"
dotenv.config();



const app =express();

const port =process.env.PORT || 5050;

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
origin:"http://localhost:5173",
credentials:true
    }
    
))
//routes
app.use("/api/auth",authRouter)
app.use("/api/message", messageRouter)

app.listen(port,(req,res)=>{
    connectDb();
    console.log(`Server is running on port :${port}`);
    
})
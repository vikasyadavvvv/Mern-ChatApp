import path from 'path'
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';


import AuthRoute from './routes/auth.route.js'
import MessageRoute from './routes/message.route.js'
import UserRoute from './routes/user.route.js'
import friendRequestRoute from './routes/friendrequest.route.js'


import ConnectMongoDb from "./Db/Connecttomongodb.js";
import {app, server} from './socket/socket.js'



const PORT=process.env.PORT || 5000;

const __dirname=path.resolve()

dotenv.config();

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth",AuthRoute)
app.use("/api/messages",MessageRoute)
app.use("/api/users",UserRoute)
app.use("/api/friend-requests",friendRequestRoute)

app.use(express.static(path.join(__dirname,"/Frontend/dist")))



server.listen(PORT,()=>{
    ConnectMongoDb();
    console.log(`Server is running on port ${PORT}` )
})
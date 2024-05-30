import express from "express";
import dotenv from "dotenv";
import AuthRoute from './routes/auth.route.js'
import MessageRoute from './routes/message.route.js'
import UserRoute from './routes/user.route.js'
import cookieParser from "cookie-parser";
import {app, server} from './socket/socket.js'

import ConnectMongoDb from "./Db/Connecttomogodb.js";

const PORT=process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

/*app.get('/',(req,resp)=>{
    resp.send("Hello World")
})*/

app.use("/api/auth",AuthRoute)
app.use("/api/messages",MessageRoute)
app.use("/api/users",UserRoute)


server.listen(PORT,()=>{
    ConnectMongoDb()
    console.log(`Server is running on port ${PORT}` )
})
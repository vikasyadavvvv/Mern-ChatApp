// server.js
import {Server} from 'socket.io'
import http from 'http'
import express from 'express'

const app=express();
const server=http.createServer(app);
const io= new Server(server,{
	cors:{
		origin:["http://localhost:3000"],
		methods:["GET","POST"]
	}
});

export const getReceiverSocketId=(ReceiverId)=>{
       return userSocketMap[ReceiverId]
}

const userSocketMap={};

io.on('connection',(socket)=>{
	console.log("A user connected",socket.id)

	const UserId=socket.handshake.query.UserId;
	if(UserId!=="undefined") userSocketMap[UserId]=socket.id

	io.emit("getOnlineUsers",Object.keys(userSocketMap))

	socket.on("disconnect",()=>{
		console.log(" User disconnected",socket.id);
		delete userSocketMap[UserId];
		io.emit("getOnlineUsers",Object.keys(userSocketMap))

	})
})
export{app,io,server}
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const SendMessage=async(req,resp)=>{
    try{
         const {message}=req.body;
         const{id : ReceiverId}=req.params;
         const SenderId=req.user._id;

        let conversation= await Conversation.findOne({
            Participants:{$all:[SenderId,ReceiverId]}
         })
         if(!conversation){
            conversation=await Conversation.create({
                Participants:[SenderId,ReceiverId]
            })
         }
         const NewMessage=new Message({
            SenderId,
            ReceiverId,
            message
         })
         if(NewMessage){
            conversation.messages.push(NewMessage._id)
         }
         resp.status(201).json(SendMessage)
         await Promise.all([conversation.save(), NewMessage.save()])

    }
    catch(error){
        console.log("Error in SendMessage Controller",error.message)
        resp.status(500).json({error:"Internal Server Error"})
    }
}
export const GetMessages=async(req,resp)=>{
    try{
        const {id:UsertoChatId}=req.params;
        const SenderId=req.user._id;

        let conversation=await Conversation.findOne({
            Participants:{$all:[SenderId,UsertoChatId]}
        }).populate("messages")
		if (!conversation) return resp.status(200).json([]);

		const messages = conversation.messages;

		resp.status(200).json(messages);


    }
    catch(error){
        console.log("Error in GetMessages Controller",error.message)
        resp.status(500).json({error:"Internal Server Error"})

    }
}
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const SendMessage = async (req, resp) => {
    try {
        const { message } = req.body;
        const { id: ReceiverId } = req.params;
        const SenderId = req.user._id;

        let conversation = await Conversation.findOne({
            Participants: { $all: [SenderId, ReceiverId] }
        });
        
        if (!conversation) {
            conversation = await Conversation.create({
                Participants: [SenderId, ReceiverId]
            });
        }

        const newMessage = new Message({
            SenderId,
            ReceiverId,
            message
        });

        await newMessage.save();  // Save the new message before pushing its ID to the conversation

        conversation.messages.push(newMessage._id);
        await conversation.save();

        const receiverSocketId=getReceiverSocketId(ReceiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        resp.status(201).json(newMessage);  // Return the created message in the response

    } catch (error) {
        console.log("Error in SendMessage Controller:", error.message);
        resp.status(500).json({ error: "Internal Server Error" });
    }
};

export const GetMessages = async (req, resp) => {
    try {
        const { id: UserToChatId } = req.params;
        const SenderId = req.user._id;

        let conversation = await Conversation.findOne({
            Participants: { $all: [SenderId, UserToChatId] }
        }).populate("messages");

        if (!conversation) return resp.status(200).json([]);

        const messages = conversation.messages;

        resp.status(200).json(messages);

    } catch (error) {
        console.log("Error in GetMessages Controller:", error.message);
        resp.status(500).json({ error: "Internal Server Error" });
    }
};

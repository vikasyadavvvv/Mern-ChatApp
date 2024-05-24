import mongoose from 'mongoose';
const MessageSchema=new mongoose.Schema({
    SenderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    ReceiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String ,
        required:true
    }


},{
    timestamps:true
})

const Message=mongoose.model("Message",MessageSchema)
export default Message
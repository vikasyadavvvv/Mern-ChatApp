import User from "../models/user.model.js"

export const GetUserforSidebar=async(req,resp)=>{
    try{
        const LoginUserId=req.user._id
        const filterUser=await User.find({_id:{$ne:LoginUserId}}).select("-password")
        resp.status(200).json(filterUser)
    }
    catch(error){
        console.log("Error in GetUserforSidebar",error.message)
        resp.status(500).json({error:"Internal Server Error"})
    }
}
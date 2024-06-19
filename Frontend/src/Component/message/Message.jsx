import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.SenderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilepic = fromMe ? authUser.profilepic : selectedConversation?.profilepic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";
    const shakeClass = message.shouldShake ? "shake" : "";

    return (
        <div className={`chat ${chatClassName} flex items-start justify-${fromMe ? 'end' : 'start'} mb-2`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt="" src={profilepic} />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} px-3 py-2 rounded-lg text-sm max-w-[70%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%]`} style={{ maxWidth: 'calc(100% - 4rem)' }}>
                {message.message}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center ml-2 mt-1'>
                {formattedTime}
            </div>
        </div>
    );
}

export default Message;

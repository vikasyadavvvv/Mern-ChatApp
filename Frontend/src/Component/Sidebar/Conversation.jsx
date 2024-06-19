
// Conversation.jsx
import { useSocketContext } from "../../context/socketContext";
import useConversation from "../../zustand/useConversation";


const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const isSelected = selectedConversation?._id === conversation._id;
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);

    return (
        <>
            <div 
                className={`flex gap-2 items-center bg-black hover:bg-sky-500 rounded p-2 cursor-pointer transition duration-200 
                    ${isSelected ? "bg-sky-500" : "bg-black"}
                `}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                    <img
                     src={conversation.profilepic || 'https://tse3.mm.bing.net/th?id=OIP.Cl56H6WgxJ8npVqyhefTdQHaHa&pid=Api&P=0&h=180'} // Replace with your fallback image path
                     alt='user avatar'
                    className="object-cover w-full h-full"
                       />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between items-center'>
                        <p className='font-bold text-white truncate'>{conversation.fullName}</p>
                        <span className='text-xl'>{emoji}</span>
                    </div>
                </div>
            </div>
            {lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
    );
};

export default Conversation;

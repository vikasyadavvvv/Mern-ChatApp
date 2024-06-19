// Conversations.jsx
import useGetConversations from "../../hooks/useConversation";
import { getRandomEmoji } from "../../utils/emoji";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	console.log("CONVERSATION", conversations);

	return (
		<div className='py-2 flex flex-col overflow-auto h-full'>
			{loading ? (
				<div className='flex justify-center items-center h-full'>
					<span className='loading loading-spinner mx-auto'></span>
				</div>
			) : (
				conversations.map((conversation, idx) => (
					<Conversation
						key={conversation._id}
						conversation={conversation}
						emoji={getRandomEmoji()}
						lastIdx={idx === conversations.length - 1}
					/>
				))
			)}
		</div>
	);
};

export default Conversations;

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
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 cursor-pointer transition duration-200 
                    ${isSelected ? "bg-sky-500" : "bg-white"}
                `}
                onClick={() => setSelectedConversation(conversation)}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 h-12 rounded-full overflow-hidden'>
                        <img
                            src={conversation.profilepic}
                            alt='user avatar'
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between items-center'>
                        <p className='font-bold text-gray-800 truncate'>{conversation.fullName}</p>
                        <span className='text-xl'>{emoji}</span>
                    </div>
                </div>
            </div>
            {lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
    );
};

export default Conversation;

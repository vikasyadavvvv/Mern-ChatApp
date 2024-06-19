import useGetConversations from "../../hooks/useConversation";
import { getRandomEmoji } from "../../utils/emoji";
import Conversation from "./Conversation";

const Conversations = () => {
    const { loading, conversations } = useGetConversations();
    console.log("CONVERSATION", conversations);

    return (
        <div className='py-2 flex flex-col overflow-auto h-50 max-h-full'> {/* Ensure max height for small screens */}
            {loading ? (
                <div className='flex justify-center items-center h-full'>
                    <span className='loading loading-spinner mx-auto'></span>
                </div>
            ) : (
                <div className='flex flex-col flex-1 overflow-auto'> {/* Enable scrolling for conversations */}
                    {conversations.map((conversation, idx) => (
                        <Conversation
                            key={conversation._id}
                            conversation={conversation}
                            emoji={getRandomEmoji()}
                            lastIdx={idx === conversations.length - 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Conversations;

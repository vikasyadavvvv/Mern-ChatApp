import React from 'react';
import useGetConversations from "../../hooks/useConversation";
import { getRandomEmoji } from "../../utils/emoji";
import Conversation from "./Conversation";

const Conversations = () => {
    const { loading, conversations } = useGetConversations();

    return (
        <div className='py-2 flex flex-col flex-grow overflow-y-auto'>
            {conversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    emoji={getRandomEmoji()} // You can customize how emojis are generated or passed
                    lastIdx={idx === conversations.length - 1} // Determine if it's the last conversation
                />
            ))}

            {loading && <span className='loading loading-spinner mx-auto'></span>}
        </div>
    );
};

export default Conversations;

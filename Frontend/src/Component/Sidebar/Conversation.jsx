import React from 'react';
import useConversation from '../../zustand/useConversation';
import { useSocketContext } from '../../context/socketContext';

const Conversation = ({ conversation, lastIdx, emoji }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();
    const isOnline = onlineUsers.includes(conversation._id);

    const handleSelectConversation = () => {
        setSelectedConversation(conversation);
    };

    return (
        <>
            <div 
                className={`flex gap-2 items-center bg-black hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
                    ${selectedConversation?._id === conversation._id ? "bg-sky-500" : "bg-black"}
                `}
                onClick={handleSelectConversation}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 h-12 rounded-full'>
                        <img
                            src={conversation.profilepic || 'https://tse3.mm.bing.net/th?id=OIP.Cl56H6WgxJ8npVqyhefTdQHaHa&pid=Api&P=0&h=180'}
                            alt='user avatar'
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

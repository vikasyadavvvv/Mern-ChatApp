import React, { useEffect, useState } from 'react';
import useConversation from '../../zustand/useConversation';
import FriendRequests from '../Friendrequest'; // Adjust path as necessary
import Messages from './Messages';
import MessageInput from './MessageInput';
import { TiMessages } from 'react-icons/ti'; // Importing TiMessages icon
import { useSocketContext } from '../../context/socketContext';
import { useAuthContext } from '../../context/AuthContext';

const MessageContainer = () => {
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const [friendRequestStatus, setFriendRequestStatus] = useState('');

    useEffect(() => {
        if (!authUser || !selectedConversation) {
            console.warn('No selected conversation or auth user.');
            return;
        }

        const fetchFriendRequestStatus = async () => {
            try {
                const response = await fetch(`/api/friend-requests/status/${authUser._id}/${selectedConversation._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch friend request status');
                }

                const data = await response.json();
                setFriendRequestStatus(data.status);
            } catch (error) {
                console.error('Error fetching friend request status:', error);
            }
        };

        fetchFriendRequestStatus();

        if (socket) {
            socket.on('friendRequestAccepted', fetchFriendRequestStatus);
            socket.on('friendRequestRejected', fetchFriendRequestStatus);
        }

        return () => {
            if (socket) {
                socket.off('friendRequestAccepted', fetchFriendRequestStatus);
                socket.off('friendRequestRejected', fetchFriendRequestStatus);
            }
        };
    }, [socket, authUser, selectedConversation]);

    const handleSendMessage = (message) => {
        // Example implementation
        console.log('Sending message:', message);
    };

    return (
        <div className="flex flex-col w-full lg:w-3/4 h-full overflow-y-auto lg:overflow-hidden">
            {!selectedConversation ? (
                <NoChatSelected authUser={authUser} />
            ) : (
                <>
                    {/* Header */}
                    <div className="bg-slate-500 px-4 py-2 mb-2 flex justify-between items-center">
                        <div>
                            <span className="label-text">To:</span>{' '}
                            <span className="text-white font-bold">{selectedConversation.fullName}</span>
                        </div>
                    </div>

                    {/* Friend Request Component */}
                    <FriendRequests />

                    {/* Conditional Rendering based on friendRequestStatus */}
                    {friendRequestStatus === 'accepted' ? (
                        <div className="flex-grow overflow-y-auto">
                            <Messages />
                            <MessageInput onSendMessage={handleSendMessage} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center mt-4">
                            <p className="text-white">
                                You cannot chat with {selectedConversation.fullName} unless the friend request is accepted.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const NoChatSelected = ({ authUser }) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="px-4 text-center sm:text-lg lg:text-xl text-white font-semibold flex flex-col items-center gap-2">
                <p>Welcome 👋 {authUser.fullName} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className="text-3xl lg:text-6xl text-center" />
            </div>
        </div>
    );
};

export default MessageContainer;

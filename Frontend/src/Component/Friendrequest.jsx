import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../context/socketContext';
import { useAuthContext } from '../context/AuthContext';
import useConversation from '../zustand/useConversation';

const FriendRequests = () => {
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const [friendRequests, setFriendRequests] = useState([]);
    const [hasRequest, setHasRequest] = useState(false);
    const [requestAccepted, setRequestAccepted] = useState(false);

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await fetch('/api/friend-requests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Ensure cookies are sent with the request
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch friend requests');
                }
                const data = await response.json();
                setFriendRequests(data);

                const existingRequest = data.find(request =>
                    (request.requester._id === authUser._id && request.recipient._id === selectedConversation._id) ||
                    (request.requester._id === selectedConversation._id && request.recipient._id === authUser._id)
                );
                setHasRequest(!!existingRequest);

                if (existingRequest && existingRequest.status === 'accepted') {
                    setRequestAccepted(true);
                } else {
                    setRequestAccepted(false);
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();

        socket.on('friendRequestReceived', fetchFriendRequests);
        socket.on('friendRequestAccepted', fetchFriendRequests);
        socket.on('friendRequestRejected', fetchFriendRequests);

        return () => {
            socket.off('friendRequestReceived', fetchFriendRequests);
            socket.off('friendRequestAccepted', fetchFriendRequests);
            socket.off('friendRequestRejected', fetchFriendRequests);
        };
    }, [socket, authUser._id, selectedConversation._id]);

    const handleAcceptRequest = async (requestId) => {
        try {
            await fetch('/api/friend-requests/accept-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
                body: JSON.stringify({ requestId }),
            });
            socket.emit('acceptFriendRequest', { requestId });

            setFriendRequests(friendRequests.map(request =>
                request._id === requestId ? { ...request, status: 'accepted' } : request
            ));

            setRequestAccepted(true); // Mark request as accepted
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            await fetch('/api/friend-requests/reject-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
                body: JSON.stringify({ requestId }),
            });
            socket.emit('rejectFriendRequest', { requestId });

            setFriendRequests(friendRequests.map(request =>
                request._id === requestId ? { ...request, status: 'rejected' } : request
            ));
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleSendRequest = async () => {
        try {
            await fetch('/api/friend-requests/send-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
                body: JSON.stringify({ requesterId: authUser._id, recipientId: selectedConversation._id }),
            });

            setHasRequest(true);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const pendingRequest = friendRequests.find(request =>
        request.status === 'pending' &&
        request.recipient._id === authUser._id &&
        request.requester._id === selectedConversation._id
    );

    return (
        <div>
            {pendingRequest ? (
                <div className='flex items-center justify-center mt-4'>
                    <button onClick={() => handleAcceptRequest(pendingRequest._id)} className='btn btn-primary rounded-3xl'>Accept</button>
                    <button onClick={() => handleRejectRequest(pendingRequest._id)} className='btn btn-secondary rounded-3xl ml-2'>Reject</button>
                </div>
            ) : (
                !hasRequest && !requestAccepted && (
                    <div className='flex items-center justify-center mt-4'>
                        <button onClick={handleSendRequest} className='btn btn-primary rounded-3xl'>Send Request</button>
                    </div>
                )
            )}
        </div>
    );
};

export default FriendRequests;

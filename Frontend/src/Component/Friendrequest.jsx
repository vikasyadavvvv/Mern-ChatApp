import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../context/socketContext';
import { useAuthContext } from '../context/AuthContext';
import useConversation from '../zustand/useConversation';

const FriendRequests = () => {
    const { selectedConversation } = useConversation();
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();
    const [friendRequests, setFriendRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [hasRequest, setHasRequest] = useState(false);
    const [requestAccepted, setRequestAccepted] = useState(false); // State to track if request is accepted

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

                const userSentRequests = data.filter(request => request.requester._id === authUser._id);
                setSentRequests(userSentRequests);

                const existingRequest = data.find(request =>
                    (request.requester._id === authUser._id && request.recipient._id === selectedConversation._id) ||
                    (request.requester._id === selectedConversation._id && request.recipient._id === authUser._id)
                );
                setHasRequest(!!existingRequest);

                // Check if request is accepted
                if (existingRequest && existingRequest.status === 'accepted') {
                    setRequestAccepted(true);
                } else {
                    setRequestAccepted(false);
                }

                // Store hasRequest in localStorage
                localStorage.setItem('hasRequest', !!existingRequest);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();

        // Socket event listeners
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

            // Store hasRequest in localStorage
            localStorage.setItem('hasRequest', true);
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

    const handleSendRequest = async (receiverId) => {
        try {
            await fetch('/api/friend-requests/send-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
                body: JSON.stringify({ requesterId: authUser._id, recipientId: selectedConversation._id }),
            });

            setSentRequests([...sentRequests, { requester: { _id: authUser._id }, recipient: { _id: receiverId }, status: 'pending' }]);
            setHasRequest(true);

            // Store hasRequest in localStorage
            localStorage.setItem('hasRequest', true);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        const storedHasRequest = localStorage.getItem('hasRequest') === 'true';
        setHasRequest(storedHasRequest);
    }, []);

    return (
        <div className='py-2 flex flex-col flex-grow h-full overflow-auto'>
            <h2 className='text-lg font-bold text-white text-center mb-4'>Friend Requests</h2>
            {friendRequests.map(request => (
                <div key={request._id} className='flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-2'>
                    <div className='flex items-center'>
                        <span className='text-white mr-2'>{authUser.fullName} wants to be your friend.</span>
                        {request.status === 'pending' && (
                            <div className='flex gap-2'>
                                <button onClick={() => handleAcceptRequest(request._id)} className='btn btn-primary rounded-3xl'>Accept</button>
                                <button onClick={() => handleRejectRequest(request._id)} className='btn btn-secondary rounded-3xl'>Reject</button>
                            </div>
                        )}
                        {request.status === 'rejected' && (
                            <span className='text-red-500'>Your request has been rejected.</span>
                        )}
                        {request.status === 'accepted' && (
                            <span className='text-green-500'>You are now friends. Start chatting!</span>
                        )}
                    </div>
                </div>
            ))}
            {/* Render Send Request button conditionally */}
            {!(requestAccepted || hasRequest) && (
                <div className='flex items-center justify-center mt-4'>
                    <button onClick={() => handleSendRequest(selectedConversation._id)} className='btn btn-primary rounded-3xl'>Send Request</button>
                </div>
            )}
        </div>
    );
};

export default FriendRequests;

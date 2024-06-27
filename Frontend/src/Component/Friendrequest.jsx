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
    const [requestRejected, setRequestRejected] = useState(false); // New state to track if request is rejected
    const [isLoading, setIsLoading] = useState(false); // Loading state

    useEffect(() => {
        const fetchFriendRequests = async () => {
            setIsLoading(true); // Set loading state before fetch
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
                setIsLoading(false); // Clear loading state after fetch

                const existingRequest = data.find(request =>
                    (request.requester._id === authUser._id && request.recipient._id === selectedConversation._id) ||
                    (request.requester._id === selectedConversation._id && request.recipient._id === authUser._id)
                );
                setHasRequest(!!existingRequest);

                if (existingRequest) {
                    if (existingRequest.status === 'accepted') {
                        setRequestAccepted(true);
                        setRequestRejected(false);
                    } else if (existingRequest.status === 'rejected') {
                        setRequestRejected(true);
                        setRequestAccepted(false);
                    } else {
                        setRequestAccepted(false);
                        setRequestRejected(false);
                    }
                } else {
                    setRequestAccepted(false);
                    setRequestRejected(false);
                }
            } catch (error) {
                console.error('Error fetching friend requests:', error);
                setIsLoading(false); // Clear loading state on error
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
            setRequestRejected(false);
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
            setRequestAccepted(false);
            setRequestRejected(true); // Mark request as rejected
            setHasRequest(false); // Allow sender to send a new request
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
            setRequestRejected(false); // Reset rejection state on new request
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const getFriendRequestStatus = async () => {
        try {
            const response = await fetch(`/api/friend-requests/status/${authUser._id}/${selectedConversation._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
            });
            if (!response.ok) {
                throw new Error('Failed to fetch friend request status');
            }
            const data = await response.json();

            if (data.status === 'not_requested') {
                console.log('No friend request exists.');
            } else if (data.status === 'pending') {
                console.log('Friend request is pending.');
            } else if (data.status === 'accepted') {
                console.log('Friend request is accepted.');
            } else if (data.status === 'rejected') {
                console.log('Friend request is rejected.');
            }
        } catch (error) {
            console.error('Error fetching friend request status:', error);
        }
    };

    const pendingRequest = friendRequests.find(request =>
        request.status === 'pending' &&
        request.recipient._id === authUser._id &&
        request.requester._id === selectedConversation._id
    );

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
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

                    {requestRejected && (
                        <div className='flex items-center justify-center mt-4'>
                            <p className='text-red-500'>Your request was rejected by {selectedConversation.fullName}.</p>
                            <button onClick={handleSendRequest} className='btn btn-primary rounded-3xl ml-2'>Send Request</button>
                        </div>
                    )}

                    {/* Display all friend requests */}
                    <div className='mt-4'>
                        <h2>Friend Requests</h2>
                        {friendRequests.map(request => (
                            <div key={request._id}>
                                <p>{request.requester.username} sent you a friend request.</p>
                                {request.status === 'pending' && (
                                    <div className='flex'>
                                        <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                                        <button onClick={() => handleRejectRequest(request._id)}>Reject</button>
                                    </div>
                                )}
                                {request.status === 'accepted' && (
                                    <p>You accepted {request.requester.username}'s request.</p>
                                )}
                                {request.status === 'rejected' && (
                                    <p>You rejected {request.requester.username}'s request.</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendRequests;

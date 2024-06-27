import FriendRequest from "../models/friendrequest.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendFriendRequest = async (req, res) => {
    const { requesterId, recipientId } = req.body;
    console.log('Request Body:', req.body); // Log request body for debugging

    if (!requesterId || !recipientId) {
        return res.status(400).json({ error: "Requester ID and Recipient ID are required" });
    }

    try {
        const friendRequest = new FriendRequest({ requester: requesterId, recipient: recipientId });
        await friendRequest.save();

        // Emit socket event to recipient
        const recipientSocketId = getReceiverSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('friendRequestReceived', { requesterId, recipientId });
        }

        res.status(201).json(friendRequest);
    } catch (error) {
        console.log('Error:', error.message); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};

// Inside acceptFriendRequest controller
// Inside acceptFriendRequest controller
export const acceptFriendRequest = async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ error: "Request ID is required" });
    }

    try {
        const friendRequest = await FriendRequest.findByIdAndUpdate(requestId, { status: 'accepted' }, { new: true });

        // Notify sender that request has been accepted
        const requesterSocketId = getReceiverSocketId(friendRequest.requester);
        if (requesterSocketId) {
            io.to(requesterSocketId).emit('friendRequestAccepted', { requestId, requesterId: friendRequest.requester, recipientId: friendRequest.recipient });
        }

        // Notify recipient that request has been accepted
        const recipientSocketId = getReceiverSocketId(friendRequest.recipient);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('friendRequestAccepted', { requestId, requesterId: friendRequest.requester, recipientId: friendRequest.recipient });
        }

        res.status(200).json(friendRequest);
    } catch (error) {
        console.log('Error:', error.message);
        res.status(400).json({ error: error.message });
    }
};


export const rejectFriendRequest = async (req, res) => {
    const { requestId } = req.body;
    console.log('Request Body:', req.body); // Log request body for debugging

    if (!requestId) {
        return res.status(400).json({ error: "Request ID is required" });
    }

    try {
        const friendRequest = await FriendRequest.findByIdAndUpdate(requestId, { status: 'rejected' }, { new: true });

        // Emit socket event to requester
        const requesterSocketId = getReceiverSocketId(friendRequest.requester);
        if (requesterSocketId) {
            io.to(requesterSocketId).emit('friendRequestRejected', { requestId, requesterId: friendRequest.requester, recipientId: friendRequest.recipient });
        }

        res.status(200).json(friendRequest);
    } catch (error) {
        console.log('Error:', error.message); // Log error for debugging
        res.status(400).json({ error: error.message });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find();
        res.status(200).json(friendRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getFriendRequestStatus = async (req, res) => {
    const { requesterId, recipientId } = req.params;
    console.log(`Requester ID: ${requesterId}, Recipient ID: ${recipientId}`); // Log the parameters

    try {
        const friendRequest = await FriendRequest.findOne({
            requester: requesterId,
            recipient: recipientId,
        });

        console.log('Friend Request Found:', friendRequest); // Log the query result

        if (!friendRequest) {
            return res.status(404).json({ status: 'not_requested' });
        }

        return res.status(200).json({ status: friendRequest.status });
    } catch (error) {
        console.error('Error fetching friend request status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

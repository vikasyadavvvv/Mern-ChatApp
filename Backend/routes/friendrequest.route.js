import express from 'express';
import { acceptFriendRequest, getFriendRequestStatus, getFriendRequests, rejectFriendRequest, sendFriendRequest } from '../Controllers/friendrequest.controller.js';
const router = express.Router();

// Route for sending a friend request
router.post('/send-request', sendFriendRequest);

// Justification: This route handles the sending of a friend request. It takes the requester and recipient IDs from the request body, passes them to the `sendFriendRequest` controller function, and returns a response based on the success or failure of the operation.

// Route for accepting a friend request
router.post('/accept-request', acceptFriendRequest);

// Justification: This route handles the acceptance of a friend request. It takes the request ID from the request body, passes it to the `acceptFriendRequest` controller function, and returns a response based on the success or failure of the operation.

// Route for rejecting a friend request
router.post('/reject-request', rejectFriendRequest);

// Justification: This route handles the rejection of a friend request. It takes the request ID from the request body, passes it to the `rejectFriendRequest` controller function, and returns a response based on the success or failure of the operation.
router.get('/', getFriendRequests); // Define a GET handler for fetching requests

router.get('/status/:requesterId/:recipientId', getFriendRequestStatus);


export default router;

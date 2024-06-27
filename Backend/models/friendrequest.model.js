import mongoose from "mongoose"
const FriendRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;
import useGetConversations from "../../hooks/useConversation";
import { getRandomEmoji } from "../../utils/emoji";
import Conversation from "./Conversation";

 const Conversations = () => {
	const {loading,conversations}=useGetConversations();
	console.log("CONVERSATION",conversations)
 	return (
 		<div className='py-2 flex flex-col overflow-auto'>
						{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
 		</div>
 	);
 };
 export default Conversations;
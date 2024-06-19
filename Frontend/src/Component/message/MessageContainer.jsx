import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	useEffect(() => {
		// Cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col h-full'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2'>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-100 font-bold'>{selectedConversation.fullName}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();

	return (
		<div className='flex items-center justify-center w-full h-full p-4'>
			<div className='text-center text-gray-200 font-semibold flex flex-col items-center gap-4'>
				<p className='text-lg sm:text-xl md:text-2xl'>Welcome 👋 {authUser.fullName} ❄</p>
				<p className='text-md sm:text-lg md:text-xl'>Select a chat to start messaging</p>
				<TiMessages className='text-4xl md:text-6xl text-center' />
			</div>
		</div>
	);
};

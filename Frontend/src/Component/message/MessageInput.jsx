import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage.js";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		await sendMessage(message.trim());
		setMessage("");
	};

	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative flex items-center'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5 pr-12 bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none'
					placeholder='Send a message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button 
					type='submit' 
					className='absolute right-2 flex items-center justify-center w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full focus:ring-2 focus:ring-sky-500 focus:outline-none'
					disabled={loading}
				>
					{loading ? <div className='loading loading-spinner'></div> : <BsSend />}
				</button>
			</div>
		</form>
	);
};

export default MessageInput;

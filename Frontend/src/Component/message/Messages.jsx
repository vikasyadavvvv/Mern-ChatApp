import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessage.js";
import MessageSkeleton from "../skeletons/MessageSkeleton.jsx";
import Message from "./Message.jsx";
import useListenMessage from "../../hooks/useListenMessage.js";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    useListenMessage();

    const lastMessageRef = useRef(null);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {!loading && messages.length > 0 ? (
                messages.map((message, index) => (
                    <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
                        <Message message={message} />
                    </div>
                ))
            ) : loading ? (
                [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
            ) : (
                <p className='text-center text-white'>Send a message to start the conversation</p>
            )}
        </div>
    );
};

export default Messages;

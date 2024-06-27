import { create } from "zustand";

const useConversation = create((set) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => {
        console.log("Setting selectedConversation:", selectedConversation);
        set({ selectedConversation });
    },
    messages: [],
    setMessages: (messages) => set({ messages }),
}));

export default useConversation;

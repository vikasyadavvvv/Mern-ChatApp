import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthContext';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("https://chatapp-dhsa.onrender.com", {
                query: {
                    UserId: authUser._id
                }
            });
            setSocket(newSocket);
            
            newSocket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected:", newSocket.id);
            });

            return () => {
                newSocket.off("getOnlineUsers");
                newSocket.close();
            }
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}

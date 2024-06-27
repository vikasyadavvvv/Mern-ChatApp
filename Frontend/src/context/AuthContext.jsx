import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(null);

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("chat-user"));
		console.log("Fetched authUser from localStorage:", user);
		setAuthUser(user);
	}, []);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};

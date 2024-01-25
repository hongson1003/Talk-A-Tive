import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const history = useHistory();
    const [selectChat, setSelectChat] = useState();
    const [chats, setChats] = useState([]);
    const [notifications, setNofitications] = useState([]);
    const [isConnectedSocket, setIsConnectedSocket] = useState(false);
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);
        if (userInfo)
            history.push('/chat');
        else
            history.push('/');
    }, [history]);

    return (
        <ChatContext.Provider value={{
            user, setUser, selectChat, setSelectChat,
            chats, setChats, notifications, setNofitications,
            isConnectedSocket, setIsConnectedSocket
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    return useContext(ChatContext);
}

export default ChatProvider;

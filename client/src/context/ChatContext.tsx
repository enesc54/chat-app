import { createContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const { serverId, roomId } = useParams();

    const [showMobileMenu, setShowMobileMenu] = useState(true);
    const [currentServer, setCurrentServer] = useState({ _id: serverId });
    const [currentRoom, setCurrentRoom] = useState({ _id: roomId });

    //TODO: get server and room data

    useEffect(() => {
        if (currentServer?._id && currentRoom?._id) {
            navigate(`/chats/${currentServer?._id}/${currentRoom?._id}`);
        }

        setShowMobileMenu(false);
    }, [currentRoom]);

    return (
        <ChatContext.Provider
            value={{
                currentServer,
                setCurrentServer,
                currentRoom,
                setCurrentRoom,
                showMobileMenu,
                setShowMobileMenu
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider };

import { createContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServers, getCategories } from "../services/http/chatService";
import { toast } from "react-toastify";
import { PopUpType } from "../layouts/chats";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const { serverId, roomId } = useParams();

    const [showMobileMenu, setShowMobileMenu] = useState(true);
    const [currentServer, setCurrentServer] = useState({ _id: serverId });
    const [currentRoom, setCurrentRoom] = useState({ _id: roomId });
    const [servers, setServers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPopUp, setCurrentPopUp] = useState<PopUpType>(
        PopUpType.CLOSED
    );

    useEffect(() => {
        getServers().then(res => {
            if (!res.success) {
                return toast.error(res.error.message);
            }
            setServers(() => res.data);
        });
    }, []);

    useEffect(() => {
        if (servers.length > 0) {
            setCurrentServer(servers.find(item => item._id == serverId));
        }
    }, [servers, serverId]);

    useEffect(() => {
        if (rooms.length > 0) {
            setCurrentRoom(rooms.find(item => item._id == roomId));
        }
    }, [rooms, roomId]);

    useEffect(() => {
        if (currentServer?._id && currentRoom?._id) {
            navigate(`/chats/${currentServer?._id}/${currentRoom?._id}`);
        }

        setShowMobileMenu(false);
    }, [currentRoom]);

    useEffect(() => {
        getCategories(currentServer._id).then(res => {
            if (!res.success) {
                return toast.error(res.error.message);
            }
            setCategories(() => res.data);
        });
    }, [currentServer]);

    return (
        <ChatContext.Provider
            value={{
                servers,
                setServers,
                rooms,
                setRooms,
                categories,
                setCategories,
                currentServer,
                setCurrentServer,
                currentRoom,
                setCurrentRoom,
                showMobileMenu,
                setShowMobileMenu,
                currentPopUp,
                setCurrentPopUp
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatProvider };

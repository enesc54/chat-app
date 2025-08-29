import MessageListView from "@components/chats/MessageListView";
import SendMessageView from "@components/chats/SendMessageView";
import TopMenu from "@components/chats/TopMenu";
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { joinRoom } from "../../services/socket/chatSocket";
import { useNavigate } from "react-router-dom";

function Chats() {
    const { showMobileMenu, currentRoom } = useContext(ChatContext);
    const [accessPermission, setAccessPermission] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        joinRoom(currentRoom._id, res => {
            if (!res.success) {
                setAccessPermission(false);
            }
        });
    }, [currentRoom]);

    useEffect(() => {
        if (!accessPermission) {
            navigate("/chats/no-permission");
        }
    }, [accessPermission]);

    return (
        <main
            className={`lg:flex flex-col flex-1 gap-2 ${
                !showMobileMenu ? "flex" : "hidden"
            }`}
        >
            <TopMenu />
            <MessageListView />
            <SendMessageView />
        </main>
    );
}
export default Chats;

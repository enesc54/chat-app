import MessageView from "./MessageView";
import { useState, useRef, useContext, useEffect } from "react";
import {
    getRoomMessages,
    receiveMessage
} from "../../services/socket/chatSocket";
import { ChatContext } from "../../context/ChatContext";
import { toast } from "react-toastify";

function MessageListView() {
    const messageListRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const { currentRoom } = useContext(ChatContext);

    useEffect(() => {
        getRoomMessages(currentRoom._id, res => {
            if (!res.success) {
                return toast.error(res.error.message);
            }
            setMessages(res.data.messages);
        });
    }, [currentRoom]);

    useEffect(() => {
        receiveMessage(msg => {
            setMessages(prev => [...prev, msg]);
        });
    }, []);

    useEffect(() => {
        const container = messageListRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);
    return (
        <div
            ref={messageListRef}
            className="bg-[#252525dd] overflow-y-auto scrollbar-hide max-h-full flex-1 rounded-lg py-4 px-6"
        >
            <div className="flex flex-col min-h-full justify-end">
                {messages.map(message => {
                    return <MessageView message={message} />;
                })}
            </div>
        </div>
    );
}

export default MessageListView;

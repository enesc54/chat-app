import MessageView from "./MessageView";
import { useState, useRef, useEffect } from "react";

function MessageListView() {
    const messageListRef = useRef(null);
    const [messages, setMessages] = useState([
        {
            senderId: "user1",
            senderName: "Sender 1",
            content: {
                type: "text",
                data: "First Message"
            }
        }
    ]);

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

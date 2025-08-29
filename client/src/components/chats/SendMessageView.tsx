import { MdOutlineAddBox } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { sendMessage } from "../../services/socket/chatSocket";
import { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { toast } from "react-toastify";
import { PopUpType } from "../../layouts/chats";

function SendMessageView() {
    const { currentRoom, setCurrentPopUp } = useContext(ChatContext);
    const [message, setMessage] = useState("");

    const handleChange = e => {
        setMessage(e.target.value);
    };

    const handleSubmit = e => {
        const messageContent = {
            type: "text",
            data: message
        };
        sendMessage(currentRoom._id, messageContent, res => {
            if (!res.success) {
                return toast.error(res.error.message);
            }
            setMessage("");
        });
    };

    return (
        <div className="card p-4 h-20 flex items-center gap-2">
            <MdOutlineAddBox
                className="w-16 h-12 hover:scale-110"
                onClick={() => {
                    setCurrentPopUp(PopUpType.FILE_SEND);
                }}
            />
            <input
                type="text"
                value={message}
                onChange={handleChange}
                className="bg-[var(--bg-color-opacity)] text-[var(--main-tet-color)] w-full h-full rounded-xl border border-[var(--border-color)] focus:border-primary focus:outline-none px-4 scrollbar-hide"
            />
            <IoSend
                onClick={handleSubmit}
                className="w-16 h-12 hover:scale-110"
            />
        </div>
    );
}

export default SendMessageView;

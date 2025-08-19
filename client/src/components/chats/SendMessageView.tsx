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
        <div className="bg-[#252525dd] mt-2 h-20 rounded-lg p-4 flex items-center">
            <MdOutlineAddBox
                className="w-12 h-12 my-1 text-white"
                onClick={() => {
                    setCurrentPopUp(PopUpType.FILE_SEND);
                }}
            />
            <textarea
                value={message}
                onChange={handleChange}
                className="mx-2 bg-[#252525dd] w-full h-full text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3 scrollbar-hide resize-none"
            />
            <IoSend
                onClick={handleSubmit}
                className="w-12 h-12 my-1 text-white"
            />
        </div>
    );
}

export default SendMessageView;

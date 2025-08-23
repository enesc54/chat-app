import { useState, useRef, useContext } from "react";
import { PopUpType } from "../../layouts/chats";
import { ChatContext } from "../../context/ChatContext";
import { joinServer } from "../../services/http/chatService";
import { toast } from "react-toastify";

function JoinServerPopUp() {
    const { setCurrentPopUp, setServers } = useContext(ChatContext);

    const [inviteUrl, setInviteUrl] = useState("");

    const joinClick = async () => {
        const match = inviteUrl.match(/\/invite\/([a-f\d]{24})$/i);
        if (!match) {
            return toast.error("Link is invalid");
        }

        const serverId = match[1];

        const res = await joinServer(serverId);

        if (!res.success) {
            return toast.error(res.error.message);
        }

        setServers(prev => [...prev, res.data]);
        setCurrentPopUp(PopUpType.CLOSED);
    };

    return (
        <div className="flex flex-col justify-center w-full">
            <input
                type="url"
                placeholder="Invitation Link"
                onChange={e => {
                    setInviteUrl(e.target.value);
                }}
                className="bg-[#252525dd] w-full h-12 text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3"
            />
            <div
                onClick={joinClick}
                className="bg-[#007BFFdd] hover:bg-[#0056b3dd] rounded-lg p-4 flex items-center mt-4 justify-center"
            >
                Join Server
            </div>
        </div>
    );
}

export default JoinServerPopUp;

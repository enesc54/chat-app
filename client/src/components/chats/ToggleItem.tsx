import { MdOutlineVolumeUp } from "react-icons/md";
import { HiHashtag } from "react-icons/hi";

import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";

function ToggleItem({ roomData }) {
    const { currentServer, currentRoom, setCurrentRoom } =
        useContext(ChatContext);
    return (
        <div
            className={`flex items-center py-0.5 px-2 hover:bg-[#25252544] rounded-lg ${
                roomData._id === currentRoom?._id ? "bg-[#25252544]" : ""
            }`}
            onClick={() => {
                setCurrentRoom(roomData);
            }}
        >
            {roomData.type === "text" ? <HiHashtag /> : <MdOutlineVolumeUp />}
            <div className="ml-2 ">{roomData.name}</div>
        </div>
    );
}
export default ToggleItem;

import { MdOutlineVolumeUp } from "react-icons/md";
import { HiHashtag } from "react-icons/hi";

import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";

function ToggleItem({ roomData }) {
    const { currentServer, currentRoom, setCurrentRoom } =
        useContext(ChatContext);
    return (
        <div
            className={`list-item-view flex items-center gap-2 ${
                roomData._id === currentRoom?._id ? "list-item-selected" : ""
            }`}
            onClick={() => {
                setCurrentRoom(roomData);
            }}
        >
            {roomData.type === "text" ? <HiHashtag /> : <MdOutlineVolumeUp />}
{roomData.name}
        </div>
    );
}
export default ToggleItem;

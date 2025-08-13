import CategoryToggle from "./CategoryToggle";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { getRooms } from "../../services/http/chatService";
import { toast } from "react-toastify";

function RoomListView() {
    const { currentServer } = useContext(ChatContext);
    const [rooms, setRooms] = useState({});

    useEffect(() => {
        getRooms(currentServer?._id).then(res => {
            if (!res.success) {
                return toast.error(res.error.message);
            }
            const grouped = res.data.reduce((acc, item) => {
                if (!acc[item.categoryId]) {
                    acc[item.categoryId] = [];
                }
                acc[item.categoryId].push(item);
                return acc;
            }, {});

            setRooms(grouped);
        });
    }, [currentServer?._id]);

    return (
        <div className="bg-[#252525dd] h-full rounded-lg p-6 overflow-y-auto scrollbar-hide">
            {Object.entries(rooms).map(([categoryId, categoryRooms]) => (
                <CategoryToggle
                    categoryId={categoryId}
                    categoryRooms={categoryRooms}
                />
            ))}
        </div>
    );
}

export default RoomListView;

import CategoryToggle from "./CategoryToggle";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { getRooms } from "../../services/http/chatService";
import { toast } from "react-toastify";

function RoomListView() {
    const { currentServer, categories, setCategories, setRooms } =
        useContext(ChatContext);
    const [roomsGroupedByCategories, setRoomsGroupedByCategories] = useState(
        []
    );

    useEffect(() => {
        if (currentServer._id) {
            getRooms(currentServer?._id).then(res => {
                if (!res.success) {
                    return toast.error(res.error.message);
                }

                const groupedRooms = categories.map(category => {
                    return {
                        ...category,
                        rooms: res.data.filter(
                            room => room.categoryId == category._id
                        )
                    };
                });

                setRooms(res.data);
                setRoomsGroupedByCategories(groupedRooms);
            });
        }
    }, [currentServer, categories]);

    return (
        <div className="bg-[#252525dd] h-full rounded-lg p-6 overflow-y-auto scrollbar-hide">
            {roomsGroupedByCategories.map(category => (
                <CategoryToggle categoryData={category} />
            ))}
        </div>
    );
}

export default RoomListView;

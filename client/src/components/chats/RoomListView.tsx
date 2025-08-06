import CategoryToggle from "./CategoryToggle";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";

function RoomListView() {
    const { currentServer } = useContext(ChatContext);
    const [rooms, setRooms] = useState([
        {
            _id: "category1",
            name: "Category 1",
            rooms: [
                { _id: "room1", name: "Room 1", type: "text" },
                { _id: "room2", name: "Room 2", type: "voice" }
            ]
        },
        {
            _id: "category2",
            name: "Category 2",
            rooms: [
                { _id: "room3", name: "Room 3", type: "text" },
                { _id: "room4", name: "Room 4", type: "voice" }
            ]
        }
    ]);

    return (
        <div className="bg-[#252525dd] h-full rounded-lg p-6 overflow-y-auto scrollbar-hide">
            {rooms.map(categoryData => (
                <CategoryToggle categoryData={categoryData} />
            ))}
        </div>
    );
}

export default RoomListView;

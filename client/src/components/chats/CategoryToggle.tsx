import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowRight,
    MdOutlineVolumeUp
} from "react-icons/md";
import { HiHashtag } from "react-icons/hi";
import ToggleItem from "./ToggleItem";
import { useState } from "react";

function CategoryToggle({ categoryData }) {
    const [isVisible, setIsVisible] = useState(true);
    const categoryRooms = categoryData.rooms;

    return (
        <div className="my-1">
            <div
                onClick={() => {
                    setIsVisible(!isVisible);
                }}
                className="flex w-full justify-between items-center"
            >
                <div className="font-bold text-md">{categoryData.name}</div>
                {isVisible ? (
                    <MdOutlineKeyboardArrowDown className="h-full w-8" />
                ) : (
                    <MdOutlineKeyboardArrowRight className="h-full w-8" />
                )}
            </div>
            {isVisible && (
                <div>
                    {categoryRooms?.map(room => <ToggleItem roomData={room} />)}
                </div>
            )}
        </div>
    );
}

export default CategoryToggle;

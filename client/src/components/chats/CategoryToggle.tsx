import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowRight,
    MdOutlineVolumeUp
} from "react-icons/md";
import { HiHashtag } from "react-icons/hi";
import { useState } from "react";
import ToggleItem from "./ToggleItem";

function CategoryToggle({ categoryData }) {
    const [isVisible, setIsVisible] = useState(true);
    return (
        <div className="text-white mb-2">
            <div
                onClick={() => {
                    setIsVisible(!isVisible);
                }}
                className="flex w-full justify-between items-center "
            >
                <div className="font-bold text-sm">{categoryData.name}</div>
                {isVisible ? (
                    <MdOutlineKeyboardArrowDown className="h-full w-6" />
                ) : (
                    <MdOutlineKeyboardArrowRight className="h-full w-6" />
                )}
            </div>
            {isVisible && (
                <div>
                    {categoryData.rooms.map(room => (
                        <ToggleItem roomData={room} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryToggle;

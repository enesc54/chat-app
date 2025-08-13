import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowRight,
    MdOutlineVolumeUp
} from "react-icons/md";
import { HiHashtag } from "react-icons/hi";
import { useState } from "react";
import ToggleItem from "./ToggleItem";

function CategoryToggle({ categoryId, categoryRooms }) {
    const [isVisible, setIsVisible] = useState(true);
    const [categoryData, setCategoryData] = useState({
        _id: categoryId,
        name: "Category"
    });
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
                    {categoryRooms.map(room => (
                        <ToggleItem roomData={room} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CategoryToggle;

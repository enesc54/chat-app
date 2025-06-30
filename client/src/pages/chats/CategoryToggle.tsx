import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowRight,
    MdOutlineVolumeUp
} from "react-icons/md";
import { HiHashtag } from "react-icons/hi";
import { useState } from "react";

function CategoryToggle() {
    const [isVisible, setIsVisible] = useState(true);
    return (
        <div className="text-white mb-2">
            <div
                onClick={() => {
                    setIsVisible(!isVisible);
                }}
                className="flex w-full justify-between items-center "
            >
                <div className="font-bold text-sm">Title</div>
                {isVisible ? (
                    <MdOutlineKeyboardArrowDown className="h-full w-6" />
                ) : (
                    <MdOutlineKeyboardArrowRight className="h-full w-6" />
                )}
            </div>
            {isVisible && (
                <div>
                    <div className="flex items-center p-0.5 hover:bg-[#25252544] rounded">
                        <HiHashtag />
                        <div className="ml-2 ">Channel Name</div>
                    </div>
                    <div className="flex items-center p-0.5 hover:bg-[#25252544] rounded">
                        <MdOutlineVolumeUp />
                        <div className="ml-2">Channel Name</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryToggle;

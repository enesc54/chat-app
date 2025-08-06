import { IoMdMenu } from "react-icons/io";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

function TopMenu() {
    const { showMobileMenu, setShowMobileMenu, currentRoom } =
        useContext(ChatContext);
    return (
        <div className="bg-[#252525dd] mb-2 h-20 rounded-lg p-4 flex items-center">
            <IoMdMenu
                className="w-12 h-12 my-1 text-white sm:hidden"
                onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                }}
            />
            <div className="text-white ml-2">{currentRoom?.name}</div>
        </div>
    );
}

export default TopMenu;

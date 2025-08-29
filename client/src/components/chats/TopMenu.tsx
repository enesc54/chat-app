import { IoMdMenu } from "react-icons/io";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

function TopMenu() {
    const { showMobileMenu, setShowMobileMenu, currentRoom } =
        useContext(ChatContext);
    return (
        <div className="card p-4 h-20 flex items-center gap-2">
            <IoMdMenu
                className="w-12 h-12 lg:hidden"
                onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                }}
            />
            {currentRoom?.name}
        </div>
    );
}

export default TopMenu;

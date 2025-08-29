import ServerListView from "./ServerListView";
import ServerBannerView from "./ServerBannerView";
import RoomListView from "./RoomListView";
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";

function LeftMenu() {
    const { showMobileMenu } = useContext(ChatContext);

    return (
        <div
            className={`lg:flex gap-2 w-full lg:w-[25%] ${
                showMobileMenu ? "flex" : "hidden"
            }`}
        >
            <aside
                className={`lg:flex flex-col w-1/5 ${
                    showMobileMenu ? "flex" : "hidden"
                }`}
            >
                {/*Server List*/}
                <ServerListView />
            </aside>
            <aside
                className={`lg:flex flex-col w-4/5 ${
                    showMobileMenu ? "flex w-[82%]" : "hidden"
                }`}
            >
                {/*Server Banner*/}
                <ServerBannerView />
                {/*Room List*/}
                <RoomListView />
            </aside>
        </div>
    );
}

export default LeftMenu;

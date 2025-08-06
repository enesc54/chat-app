import ServerListView from "./ServerListView";
import ServerBannerView from "./ServerBannerView";
import RoomListView from "./RoomListView";
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";

function LeftMenu() {
    const { showMobileMenu } = useContext(ChatContext);

    return (
        <>
            <aside
                className={`sm:flex flex-col lg:w-[6%] sm:w-[10%] pl-2 pr-1 py-2  ${
                    showMobileMenu ? "flex w-[18%]" : "hidden"
                }`}
            >
                {/*Server List*/}
                <ServerListView />
            </aside>
            <aside
                className={`sm:flex flex-col lg:w-[18%] sm:w-[30%] px-1 py-2 ${
                    showMobileMenu ? "flex w-[82%]" : "hidden"
                }`}
            >
                {/*Server Banner*/}
                <ServerBannerView />
                {/*Room List*/}
                <RoomListView />
            </aside>
        </>
    );
}

export default LeftMenu;

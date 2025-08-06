import { Outlet } from "react-router-dom";

import { IoMdMenu } from "react-icons/io";
import MessageListView from "@components/chats/MessageListView";
import SendMessageView from "@components/chats/SendMessageView";
import OnlineFriendsView from "@components/chats/OnlineFriendsView";
import QuickSettingsView from "@components/chats/QuickSettingsView";
import LeftMenu from "@components/chats/LeftMenu";


function ChatPageLayout() {
    return (
        <div className="flex h-dvh w-full bg-[url('/login_background.jpg')]">
            <LeftMenu />
            <Outlet />
            <aside className="lg:flex flex-col w-[20%] pl-1 pr-2 py-2 hidden">
                <OnlineFriendsView />
                <QuickSettingsView />
            </aside>
        </div>
    );
}

export default ChatPageLayout;

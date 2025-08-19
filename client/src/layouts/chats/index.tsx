import { Outlet } from "react-router-dom";
import { IoMdMenu } from "react-icons/io";
import MessageListView from "@components/chats/MessageListView";
import SendMessageView from "@components/chats/SendMessageView";
import OnlineFriendsView from "@components/chats/OnlineFriendsView";
import QuickSettingsView from "@components/chats/QuickSettingsView";
import LeftMenu from "@components/chats/LeftMenu";
import { useState, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import FileSendPopUp from "@components/chats/FileSendPopUp";

export enum PopUpType {
    CLOSED = "CLOSED",
    FILE_SEND = "FILE_UPLOAD",
    SETTINGS = "SETTINGS"
}

function ChatPageLayout() {
    const { currentPopUp, setCurrentPopUp } = useContext(ChatContext);

    const getPopUpView = () => {
        switch (currentPopUp) {
            case PopUpType.FILE_SEND:
                return <FileSendPopUp />;
            default:
                return null
        }
    };

    return (
        <div>
            <div className="flex h-dvh w-full bg-[url('/login_background.jpg')]">
                <LeftMenu />
                <Outlet />
                <aside className="lg:flex flex-col w-[20%] pl-1 pr-2 py-2 hidden">
                    <OnlineFriendsView />
                    <QuickSettingsView />
                </aside>
            </div>
            <div
                className={`absolute flex h-dvh w-full top-0 left-0 bg-[#050505aa] items-center justify-center text-white ${
                    currentPopUp === PopUpType.CLOSED ? "hidden" : ""
                }`}
            >
                <div className="w-[85%] h-[85%] lg:w-[60%] lg:h-[70%] bg-[#252525dd] rounded-xl p-4">
                    {currentPopUp !== PopUpType.CLOSED && getPopUpView()}
                </div>
            </div>
        </div>
    );
}

export default ChatPageLayout;

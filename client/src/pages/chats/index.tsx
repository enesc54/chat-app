import MessageListView from "@components/chats/MessageListView";
import SendMessageView from "@components/chats/SendMessageView";
import TopMenu from "@components/chats/TopMenu";

import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

function Chats() {
    const { showMobileMenu } = useContext(ChatContext);
    return (
        <main
            className={`sm:flex flex-col flex-1 px-1 py-2 ${
                !showMobileMenu ? "flex" : "hidden"
            }`}
        >
            <TopMenu />
            <MessageListView />
            <SendMessageView />
        </main>
    );
}
export default Chats;

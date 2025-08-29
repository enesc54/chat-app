import { MdOutlineAddBox } from "react-icons/md";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { getServers } from "../../services/http/chatService";
import { PopUpType } from "../../layouts/chats";
import { toast } from "react-toastify";

function ServerListView() {
    const { servers, currentServer, setCurrentServer, setCurrentPopUp } =
        useContext(ChatContext);

    const joinServerClick = () => {
        setCurrentPopUp(PopUpType.CREATE_SERVER);
    };
    return (
        <>
            {/*Servers*/}
            <div className="card p-4 scrollable h-full">
                <div className="centered">
                    {servers.map(server => (
                        <img
                            key={server._id}
                            src={server.logo}
                            alt={server.name}
                            className={`aspect-square rounded-xl object-cover w-full my-1 hover:scale-110 ${
                                server._id === currentServer?._id && "scale-110"
                            }`}
                            onClick={() => {
                                setCurrentServer(server);
                            }}
                        />
                    ))}
                </div>
            </div>
            {/*Add Server Button*/}
            <div
                onClick={joinServerClick}
                className="card p-4 centered h-20 mt-2"
            >
                <MdOutlineAddBox className="w-16 h-12 hover:scale-110" />
            </div>
        </>
    );
}

export default ServerListView;

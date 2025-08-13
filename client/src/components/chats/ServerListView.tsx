import { MdOutlineAddBox } from "react-icons/md";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { getServers } from "../../services/http/chatService";
import { toast } from "react-toastify";

function ServerListView() {
    const { currentServer, setCurrentServer } = useContext(ChatContext);
    const [servers, setServers] = useState([]);

    useEffect(() => {
        getServers().then(res => {
            if (!res.success) {
                return toast.error(res.error.message);
            }
            setServers(res.data);
        });
    }, []);

    return (
        <>
            {/*Servers*/}
            <div className="flex-1 bg-[#252525dd] overflow-y-auto  h-full rounded-lg pt-6 pb-4 scrollbar-hide">
                <div className="flex flex-col items-center px-2 ">
                    {servers.map(server => (
                        <img
                            key={server._id}
                            src={server.logo}
                            alt={server.name}
                            className={`aspect-square w-full bg-red-400 rounded-lg my-1 hover:scale-110 ${
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
            <div className="flex items-center justify-center bg-[#252525dd] mt-2 h-20 rounded-lg">
                <MdOutlineAddBox className="w-12 h-12 rounded-lg my-1 text-white" />
            </div>
        </>
    );
}

export default ServerListView;

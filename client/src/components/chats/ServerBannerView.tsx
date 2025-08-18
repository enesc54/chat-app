import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";

function ServerBannerView() {
    const { currentServer } = useContext(ChatContext);

    return (
        <div className="bg-[#252525dd] flex flex-col mb-2 h-52 rounded-lg">
            <div
                className={`w-full h-full rounded-lg bg-[url(${currentServer.banner})] bg-cover bg-center`}
            >
                <div className="w-full h-full rounded-lg bg-gradient-to-t from-[#252525ff] to-[#25252500] flex items-end p-6 text-white">
                    <img
                        src={currentServer.logo}
                        className="w-8 h-8 rounded-lg"
                    />
                    <div className="ml-2">{currentServer.name}</div>
                </div>
            </div>
        </div>
    );
}

export default ServerBannerView;

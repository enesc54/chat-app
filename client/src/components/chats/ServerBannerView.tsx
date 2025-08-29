import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";

function ServerBannerView() {
    const { currentServer } = useContext(ChatContext);

    return (
        <div className="card p-0 h-64 flex flex-col mb-2">
            <div
                className={`w-full h-full bg-center bg-cover rounded-xl`}
                style={{ backgroundImage: `url(${currentServer.banner} )` }}
            >
                <div
                    className={`w-full h-full rounded-xl ${
                        currentServer.banner && "gradient-to-top"
                    } flex items-end p-6`}
                >
                    <img
                        src={currentServer.logo}
                        className="aspect-square rounded-xl w-12 object-cover"
                    />
                    <div className="ml-2">{currentServer.name}</div>
                </div>
            </div>
        </div>
    );
}

export default ServerBannerView;

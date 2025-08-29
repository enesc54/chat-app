import { CiFileOn } from "react-icons/ci";
import { LuAudioLines } from "react-icons/lu";
import { FaPlay, FaPause } from "react-icons/fa";

import FileView from "./FileView";
import AudioPlayerView from "./AudioPlayerView";
import VideoPlayerView from "./VideoPlayerView";
import ImageView from "./ImageView";

function MessageView({ message }) {
    return (
        <div>
            <div className="flex items-center my-4 gap-2">
                <img
                    src="/login_background.jpg"
                    className="w-8 h-8 rounded-xl"
                />
                <div className="font-bold">
                    {message.senderName}Enes Can
                </div>
            </div>
            <div className="ml-12">
                {message.content.type === "text" && (
                    <div>{message.content.data}</div>
                )}
                {message.content.type === "image" && (
                    <ImageView
                        fileId={message.content.fileId}
                        fileUrl={message.content.data}
                    />
                )}
                {message.content.type === "video" && (
                    <VideoPlayerView
                        fileId={message.content.fileId}
                        fileUrl={message.content.data}
                    />
                )}
                {message.content.type === "file" && (
                    <FileView
                        fileId={message.content.fileId}
                        fileUrl={message.content.data}
                    />
                )}
                {message.content.type === "audio" && (
                    <AudioPlayerView
                        fileId={message.content.fileId}
                        fileUrl={message.content.data}
                    />
                )}
            </div>
        </div>
    );
}

export default MessageView;

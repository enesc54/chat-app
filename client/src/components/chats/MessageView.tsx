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
            <div className="flex items-end mt-4 mb-2 text-white">
                <img
                    src="/login_background.jpg"
                    className="w-8 h-8 rounded-lg"
                />
                <div className="ml-2 font-bold">{message.senderName}</div>
            </div>
            {message.content.type === "text" && (
                <div className="pl-10 text-white">{message.content.data}</div>
            )}
            {message.content.type === "image" && (
                <ImageView fileId={message.content.data} />
            )}
            {message.content.type === "video" && (
                <VideoPlayerView fileId={message.content.data} />
            )}
            {message.content.type === "file" && (
                <FileView fileId={message.content.data} />
            )}
            {message.content.type === "audio" && (
                <AudioPlayerView fileId={message.content.data} />
            )}
        </div>
    );
}

export default MessageView;

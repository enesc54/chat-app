import { FaPlay, FaPause } from "react-icons/fa";
import {
    TbPlayerTrackPrevFilled,
    TbPlayerTrackNextFilled
} from "react-icons/tb";
import { useRef, useState } from "react";

function VideoPlayerView({ fileId,fileUrl }) {
    const videoRef = useRef(null);
    const progressBarRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const [file, setFile] = useState({
        _id: "fileId",
        fileName: "file name",
        fileType: "audio",
        fileUrl: "fileUrl",
        fileSize: 16384
    });

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) video.pause();
        else video.play();

        setIsPlaying(!isPlaying);
    };

    const handleLoadedMetadata = () => {
        const video = videoRef.current;
        if (video) {
            setDuration(video.duration);
        }
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video) {
            setCurrentTime(video.currentTime);
        }
    };

    const formatTime = time => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    const forward10 = () => {
        const video = videoRef.current;
        if (video) video.currentTime += 10;
    };

    const rewind10 = () => {
        const video = videoRef.current;
        if (video) video.currentTime -= 10;
    };

    const handleProgressBarClick = e => {
        const progressBar = progressBarRef.current;
        const video = videoRef.current;

        if (!progressBar || !video) return;

        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickRatio = clickX / width;

        const newTime = clickRatio * duration;
        video.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div className="relative ml-10 max-w-sm rounded-lg overflow-hidden group">
            <video
                ref={videoRef}
                src={fileUrl}
                width="100%"
                height="100%"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(!isPlaying)}
                className="video"
            />
            <div className="absolute h-full bottom-0 right-0 left-0 text-white hidden group-hover:flex flex-col items-center justify-end p-6 gap-4 bg-gradient-to-t from-[#000000ff] to-[#00000000] ">
                <div className="flex w-full h-6 items-center gap-2 text-sm text-gray-500">
                    {formatTime(currentTime)}
                    <div
                        className="h-1 w-full bg-gray-600 rounded"
                        ref={progressBarRef}
                        onClick={handleProgressBarClick}
                    >
                        <div
                            style={{
                                width: `${(currentTime / duration) * 100}%`
                            }}
                            className="h-full rounded bg-white"
                        ></div>
                    </div>
                    {formatTime(duration)}
                </div>

                <div className="flex flex-row gap-10">
                    <TbPlayerTrackPrevFilled
                        onClick={rewind10}
                        className="w-6 h-6"
                    />
                    {isPlaying ? (
                        <FaPause onClick={togglePlay} className="w-6 h-6" />
                    ) : (
                        <FaPlay onClick={togglePlay} className="w-6 h-6" />
                    )}
                    <TbPlayerTrackNextFilled
                        onClick={forward10}
                        className="w-6 h-6"
                    />
                </div>
            </div>
        </div>
    );
}

export default VideoPlayerView;

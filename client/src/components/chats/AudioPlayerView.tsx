import { LuAudioLines } from "react-icons/lu";
import { FaPlay, FaPause } from "react-icons/fa";
import { useRef, useState } from "react";

function AudioPlayerView({ fileId, fileUrl }) {
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) audio.pause();
        else audio.play();

        setIsPlaying(!isPlaying);
    };

    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        if (audio) {
            setDuration(audio.duration);
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) {
            setCurrentTime(audio.currentTime);
        }
    };

    const formatTime = time => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${paddedMinutes}:${paddedSeconds}`;
    };

    const handleProgressBarClick = e => {
        const progressBar = progressBarRef.current;
        const audio = audioRef.current;

        if (!progressBar || !audio) return;

        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickRatio = clickX / width;

        const newTime = clickRatio * duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div className="h-12 flex gap-2 items-center">
            <div className="aspect-square rounded-xl h-full bg-primary p-2 text-white">
                <LuAudioLines className="w-full h-full" />
            </div>
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(!isPlaying)}
                src={fileUrl}
            />
            <div className="flex gap-2 items-center">
                {isPlaying ? (
                    <FaPause onClick={togglePlay} className="w-8 h-8" />
                ) : (
                    <FaPlay onClick={togglePlay} className="w-8 h-8" />
                )}
                <div
                    className="h-1 w-32 bg-background-progressBar rounded-xl"
                    ref={progressBarRef}
                    onClick={handleProgressBarClick}
                >
                    <div
                        style={{
                            width: `${(currentTime / duration) * 100}%`
                        }}
                        className="h-full rounded-xl bg-white"
                    ></div>
                </div>
                <div className="text-sm text-text-info">{`${formatTime(
                    currentTime
                )}/${formatTime(duration)}`}</div>
            </div>
        </div>
    );
}

export default AudioPlayerView;

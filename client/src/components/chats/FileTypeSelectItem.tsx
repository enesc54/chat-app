import {
    LuFileVideo,
    LuFileImage,
    LuFileAudio,
    LuFileText
} from "react-icons/lu";
import { useRef } from "react";

const options = {
    image: {
        bgColor: "#2563EB80",
        borderColor: "#2563EB",
        text: "Image",
        icon: <LuFileImage />,
        accept: "image/*"
    },
    video: {
        bgColor: "#DC262680",
        borderColor: "#DC2626",
        text: "Video",
        icon: <LuFileVideo />,
        accept: "video/*"
    },
    file: {
        bgColor: "#7C3AED80",
        borderColor: "#7C3AED",
        text: "File",
        icon: <LuFileText />,
        accept: ".pdf, .doc, .dox, .xlsx, .pptx, .txt"
    },
    audio: {
        bgColor: "#EA580C80",
        borderColor: "#EA580C",
        text: "Audiio",
        icon: <LuFileAudio />,
        accept: "audio/*"
    }
};

export enum FileTypeSelectItemType {
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    FILE = "file"
}

const FileTypeSelectItem = ({ type, setSelectedFile, setSelectedFileType }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const onFileSelected = event => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setSelectedFile(selectedFile);
            setSelectedFileType(type);
        }
    };
    return (
        <div
            className="flex gap-4 items-center p-8 bg-[var(--bg-color)] hover:scale-95 shadow-xl aspect-[3/2] rounded-xl"
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                accept={options[type].accept}
                onChange={onFileSelected}
            />
            <div
                className="w-16 flex items-center justify-center text-4xl rounded-2xl aspect-square"
                style={{
                    backgroundColor: options[type].bgColor,
                    borderColor: options[type].borderColor
                }}
            >
                {options[type].icon}
            </div>
            <div className="text-xl text-[var(--main-text-color)]">
                {options[type].text}
            </div>
        </div>
    );
};

export default FileTypeSelectItem;

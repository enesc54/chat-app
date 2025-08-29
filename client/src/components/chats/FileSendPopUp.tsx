import FileTypeSelectItem, {
    FileTypeSelectItemType
} from "./FileTypeSelectItem";
import { useState, useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import { PopUpType } from "../../layouts/chats";

import { FiUpload } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";

import { uploadFile } from "../../services/http/fileService";
import { sendMessage } from "../../services/socket/chatSocket";

function FileSendPopUp() {
    const { currentRoom, setCurrentPopUp } = useContext(ChatContext);

    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
    const [selectedFileType, setSelectedFileType] = useState();

    const handleSendClick = async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const res = await uploadFile(formData);
        if (!res.success) {
            return toast.error(res.error.message);
        }

        const messageContent = {
            type: selectedFileType,
            data: res.data.url,
            fileId: res.data._id
        };

        sendMessage(currentRoom._id, messageContent, response => {
            if (!response.success) {
                return toast.error(response.error.message);
            }

            setCurrentPopUp(PopUpType.CLOSED);
        });
    };

    useEffect(() => {
        if (selectedFile) {
            setIsFileSelected(true);
        }
    }, [selectedFile]);

    return (
        <div
            className={`w-full flex items-center justify-center ${
                isFileSelected
                    ? "flex flex-col gap-12 items-center justify-center"
                    : "grid grid-cols-2 lg:grid-cols-3"
            } gap-4 items-center`}
        >
            {isFileSelected ? (
                <>
                    <div className="flex flex-col h-64 lg:h-72 gap-8 p-8 items-center justify-center bg-[var(--bg-color)] text-[var(--main-text-color)] shadow-xl aspect-[3/2] rounded-xl">
                        <FiUpload className="w-16 h-16" />
                        File Name:{selectedFile.name}
                    </div>
                    <div
                        onClick={handleSendClick}
                        className="flex gap-4 items-center text-xl bg-primary hover:bg-primary-hover p-4 rounded-xl"
                    >
                        Send <IoSend />
                    </div>
                </>
            ) : (
                <>
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.FILE}
                        setSelectedFileType={setSelectedFileType}
                        setSelectedFile={setSelectedFile}
                    />
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.AUDIO}
                        setSelectedFileType={setSelectedFileType}
                        setSelectedFile={setSelectedFile}
                    />
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.IMAGE}
                        setSelectedFileType={setSelectedFileType}
                        setSelectedFile={setSelectedFile}
                    />
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.VIDEO}
                        setSelectedFileType={setSelectedFileType}
                        setSelectedFile={setSelectedFile}
                    />
                </>
            )}
        </div>
    );
}
export default FileSendPopUp;

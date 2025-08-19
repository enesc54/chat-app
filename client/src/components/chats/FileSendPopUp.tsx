import FileTypeSelectItem, {
    FileTypeSelectItemType
} from "./FileTypeSelectItem";
import { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { IoSend } from "react-icons/io5";

function FileSendPopUp() {
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [selectedFile, setSelectedFile] = useState();

    useEffect(() => {
        if (selectedFile) {
            setIsFileSelected(true);
        }
    }, [selectedFile]);

    return (
        <div
            className={`w-full flex items-center justify-center  ${
                isFileSelected
                    ? "flex flex-col gap-12 items-center justify-center"
                    : "grid grid-cols-2 lg:grid-cols-3"
            } gap-4 items-center`}
        >
            {isFileSelected ? (
                <>
                    <div className="flex flex-col h-64 lg:h-72 gap-8 items-center justify-center bg-[#252525] shadow-lg aspect-[3/2] rounded-xl">
                        <FiUpload className="w-16 h-16" />
                        File Name:{selectedFile.name}
                    </div>
                    <div className="flex gap-4 items-center text-xl bg-[#007BFFdd] hover:bg-[#0056b3dd] p-4 rounded-lg">
                        Send <IoSend />
                    </div>
                </>
            ) : (
                <>
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.FILE}
                        setSelectedFile={setSelectedFile}
                    />
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.AUDIO}
                        setSelectedFile={setSelectedFile}
                    />
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.IMAGE}
                        setSelectedFile={setSelectedFile}
                    />
                    <FileTypeSelectItem
                        type={FileTypeSelectItemType.VIDEO}
                        setSelectedFile={setSelectedFile}
                    />
                </>
            )}
        </div>
    );
}
export default FileSendPopUp;

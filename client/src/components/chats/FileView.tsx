import { CiFileOn } from "react-icons/ci";
import { useState } from "react";

function FileView({ fileId, fileUrl }) {
    const [file, setFile] = useState({
        _id: "fileId",
        fileName: "File Name",
        fileType: "file",
        fileUrl: "fileUrl",
        fileSize: 16380
    });

    const handleDownload = () => {
        window.open(`${fileUrl}`);
    };

    const formatFileSize = size => {
        const units = ["B", "KB", "MB", "GB", "TB"];
        let i = 0;

        while (size >= 1000 && i < units.length - 1) {
            size /= 1000;
            i++;
        }

        return `${size.toFixed(2)} ${units[i]}`;
    };

    return (
        <div className="ml-10 w-36 h-12 rounded-lg flex gap-2 items-center text-white">
            <div className="aspect-square h-full rounded-lg bg-blue-100 p-2 text-black">
                <CiFileOn onClick={handleDownload} className="w-full h-full" />
            </div>
            <div>
                <div>{file.fileName}</div>
                <div className="text-xs text-gray-500">
                    {formatFileSize(file.fileSize)}
                </div>
            </div>
        </div>
    );
}

export default FileView;

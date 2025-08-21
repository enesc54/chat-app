import { CiFileOn } from "react-icons/ci";
import { useState, useEffect } from "react";
import { getFileInfo } from "../../services/http/fileService";
import { toast } from "react-toastify";

function FileView({ fileId, fileUrl }) {
    const [file, setFile] = useState({});

    useEffect(() => {
        getFileInfo(fileId).then(res => {
            if (!res.success) {
              toast.error(res.error.message)
            }

            setFile(res.data);
        });
    }, []);

    const handleDownload = () => {
        window.open(`${fileUrl}`);
    };

    const formatFileSize = size => {
        if (!size) {
            return "-";
        }
        const units = ["B", "KB", "MB", "GB", "TB"];
        let i = 0;

        while (size >= 1000 && i < units.length - 1) {
            size /= 1000;
            i++;
        }

        return `${size.toFixed(2)} ${units[i]}`;
    };

    return (
        <div className="ml-10 h-12 rounded-lg flex gap-2 items-center text-white">
            <div className="aspect-square h-full rounded-lg bg-blue-100 p-2 text-black">
                <CiFileOn onClick={handleDownload} className="w-full h-full" />
            </div>
            <div>
                <div>{file.name ?? ""}</div>
                <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                </div>
            </div>
        </div>
    );
}

export default FileView;

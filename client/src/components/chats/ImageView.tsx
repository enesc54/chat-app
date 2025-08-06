import { useState } from "react";

function ImageView({ fileId }) {
    const [file, setFile] = useState({
        _id: "fileId",
        fileName: "file name",
        fileType: "image",
        fileUrl: "fileUrl",
        fileSize: 16384
    });
    return <img className="ml-10 rounded-lg max-w-sm" src={file.fileUrl} />;
}

export default ImageView;

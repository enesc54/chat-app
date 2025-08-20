import { useState } from "react";

function ImageView({ fileId, fileUrl }) {
    
    return <img className="ml-10 rounded-lg max-w-sm" src={fileUrl} />;
}

export default ImageView;

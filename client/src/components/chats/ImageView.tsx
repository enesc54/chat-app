import { useState } from "react";

function ImageView({ fileId, fileUrl }) {
    return <img className="rounded-xl max-w-sm" src={fileUrl} />;
}

export default ImageView;

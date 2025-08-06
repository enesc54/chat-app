import { MdOutlineAddBox } from "react-icons/md";
import { IoSend } from "react-icons/io5";

function SendMessageView() {
    return (
        <div className="bg-[#252525dd] mt-2 h-20 rounded-lg p-4 flex items-center">
            <MdOutlineAddBox className="w-12 h-12 my-1 text-white" />
            <textarea className="mx-2 bg-[#252525dd] w-full h-full text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3 scrollbar-hide resize-none" />
            <IoSend className="w-12 h-12 my-1 text-white" />
        </div>
    );
}

export default SendMessageView;

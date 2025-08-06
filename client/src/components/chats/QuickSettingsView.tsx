import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import { MdOutlineSettings } from "react-icons/md";

function QuickSettingsView() {
    return (
        <div className="bg-[#252525dd] mt-2 h-20 rounded-lg flex items-center justify-around p-4">
            {/*User Profile*/}
            <img src="/login_background.jpg" className="w-10 h-10 rounded-lg" />
            {/*Microphone Control*/}
            <BiMicrophone className="w-10 h-10 my-1 text-white" />
            {/*Headphone Control*/}
            <TbHeadphones className="w-10 h-10 my-1 text-white" />
            {/*Settings*/}
            <MdOutlineSettings className="w-10 h-10 my-1 text-white" />
        </div>
    );
}

export default QuickSettingsView;

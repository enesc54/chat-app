import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import { MdOutlineSettings } from "react-icons/md";

function QuickSettingsView() {
    return (
        <div className="card p-4 mt-2 h-20 flex items-center justify-around">
            {/*User Profile*/}
            <img
                src="https://xjgddaylqjdcmvkzzeaj.supabase.co/storage/v1/object/public/files/app_main_background.jpg"
                className="w-12 h-12 hover:scale-110 rounded-xl"
            />
            {/*Microphone Control*/}
            <BiMicrophone className="w-12 h-12 hover:scale-110" />
            {/*Headphone Control*/}
            <TbHeadphones className="w-12 h-12 hover:scale-110" />
            {/*Settings*/}
            <MdOutlineSettings className="w-12 h-12 hover:scale-110" />
        </div>
    );
}

export default QuickSettingsView;

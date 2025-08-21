import ServerTemplateSelectItem, {
    ServerTemplateTypes
} from "./ServerTemplateSelectItem";
import { useState, useRef, useContext } from "react";
import { TbUpload } from "react-icons/tb";
import { PopUpType } from "../../layouts/chats";
import { ChatContext } from "../../context/ChatContext";

function CreateServerPopUp() {
    const { setCurrentPopUp } = useContext(ChatContext);

    const [selectedType, setSelectedType] = useState<ServerTemplateTypes>();
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [logoFile, setLogoFile] = useState();
    const [bannerFile, setBannerFile] = useState();
    const [serverName, setServerName] = useState("");
    const [serverDescription, setServerDescription] = useState("");

    const logoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const logoUploadClick = () => {
        logoInputRef.current.click();
    };

    const bannerUploadClick = () => {
        bannerInputRef.current.click();
    };

    const onLogoFileSelected = event => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setLogoFile(selectedFile);
            setLogoPreview(URL.createObjectURL(selectedFile));
        }
    };

    const onBannerFileSelected = event => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setBannerFile(selectedFile);
            setBannerPreview(URL.createObjectURL(selectedFile));
        }
    };

    return (
        <div className="h-full flex w-full flex-col">
            {!selectedType ? (
                <>
                    <ServerTemplateSelectItem
                        type={ServerTemplateTypes.NOT_USING}
                    />
                    <div className="text-gray-500 m-4">
                        create with template
                    </div>
                    <ServerTemplateSelectItem
                        setSelectedType={setSelectedType}
                        type={ServerTemplateTypes.GAMING}
                    />
                    <ServerTemplateSelectItem
                        setSelectedType={setSelectedType}
                        type={ServerTemplateTypes.FRIENDS}
                    />
                    <ServerTemplateSelectItem
                        setSelectedType={setSelectedType}
                        type={ServerTemplateTypes.SCHOOL}
                    />
                    <ServerTemplateSelectItem
                        setSelectedType={setSelectedType}
                        type={ServerTemplateTypes.WORKING}
                    />

                    <div
                        onClick={() => {
                            setCurrentPopUp(PopUpType.JOIN_SERVER);
                        }}
                        className="shrink-0 bg-[#007BFFdd] hover:bg-[#0056b3dd] rounded-lg p-4 flex items-center mt-4 justify-center"
                    >
                        Bir Server'a Katıl
                    </div>
                </>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="flex w-full gap-4 mb-4">
                        <div
                            onClick={logoUploadClick}
                            className="flex flex-col gap-2 items-center justify-center rounded-lg text-xs text-gray-300 aspect-square h-32 bg-[#252525] shadow-lg overflow-hidden"
                        >
                            {!logoFile ? (
                                <>
                                    <TbUpload className="w-8 h-8" />
                                    Upload Logo
                                </>
                            ) : (
                                <img
                                    src={logoPreview}
                                    className="object-cover w-full h-full"
                                />
                            )}
                            <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onLogoFileSelected}
                            />
                        </div>
                        <div
                            onClick={bannerUploadClick}
                            className="flex flex-col gap-2 items-center justify-center rounded-lg text-xs text-gray-300 aspect-video h-32 bg-[#252525] shadow-lg overflow-hidden"
                        >
                            {!bannerFile ? (
                                <>
                                    <TbUpload className="w-8 h-8" />
                                    Upload Banner
                                </>
                            ) : (
                                <img
                                    src={bannerPreview}
                                    className="object-cover w-full h-full"
                                />
                            )}
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onBannerFileSelected}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-2 h-full">
                        <input
                            type="text"
                            placeholder="Server Name"
                            onChange={e => {
                                setServerName(e.target.value);
                            }}
                            className="bg-[#252525dd] w-full h-12 text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3"
                        />
                        <textarea
                            placeholder="Server Description"
                            onChange={e => {
                                setServerDescription(e.target.value);
                            }}
                            className="bg-[#252525dd] w-full h-18 text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3"
                        />
                    </div>
                    <div className="bg-[#007BFFdd] hover:bg-[#0056b3dd] rounded-lg p-4 flex items-center mt-4 justify-center">
                        Create Server
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateServerPopUp;

import { MdOutlineAddBox, MdOutlineSettings } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { TbHeadphones, TbHeadphonesOff } from "react-icons/tb";
import CategoryToggle from "./CategoryToggle";

function Chats() {
    return (
        <div className="flex h-dvh w-full bg-[url('/login_background.jpg')]">
            <aside className="flex flex-col w-[6%] pl-2 pr-1 py-2">
                <div className="flex-1 bg-[#252525dd] overflow-y-auto  h-full rounded-lg  pt-6 pb-4 scrollbar-hide">
                    <div className="flex flex-col items-center">
                        <div className="w-14 h-14 bg-blue-400 rounded-lg my-1"></div>
                        <hr className="w-16 border-gray-400 my-1" />
                        <div className="w-14 h-14 bg-red-400 rounded-lg my-1"></div>
                        <div className="w-14 h-14 bg-red-400 rounded-lg my-1"></div>
                    </div>
                </div>
                <div className="flex items-center justify-center bg-[#252525dd] mt-2 h-20 rounded-lg">
                    <MdOutlineAddBox className="w-12 h-12 rounded-lg my-1 text-white" />
                </div>
            </aside>
            <aside className="flex flex-col w-[18%] px-1 py-2">
                <div className="bg-[#252525dd] flex flex-col mb-2 h-52 rounded-lg">
                    <div className="w-full h-full rounded-lg bg-[url('/login_background.jpg')] bg-contain bg-center">
                        <div className="w-full h-full rounded-lg bg-gradient-to-t from-[#252525ff] to-[#25252500] flex items-end p-6 text-white">
                            <img
                                src="/login_background.jpg"
                                className="w-8 h-8 rounded-lg"
                            />
                            <div className="ml-2">Server Name</div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#252525dd] h-full rounded-lg p-6 overflow-y-auto scrollbar-hide">
                    <CategoryToggle />
                </div>
            </aside>
            <main className="flex flex-col flex-1 px-1 py-2 ">
                <div className="bg-[#252525dd] overflow-y-auto scrolltoscrollbar-hide max-h-full flex-1 rounded-lg py-4 px-6">
                    <div className="flex flex-col min-h-full justify-end">
                        <div>
                            <div className="flex items-end my-2 text-white">
                                <img
                                    src="/login_background.jpg"
                                    className="w-8 h-8 rounded-lg"
                                />
                                <div className="ml-2 font-bold">
                                    Sender Name
                                </div>
                            </div>
                            <div className="pl-10 text-white">
                                Message content
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-[#252525dd] mt-2 h-20 rounded-lg p-4 flex items-center">
                    <MdOutlineAddBox className="w-12 h-12 my-1 text-white" />
                    <textarea className="mx-2 bg-[#252525dd] w-full h-full text-white rounded-lg border-[1px] border-[#ffffff33] focus:border-blue-200 focus:outline-none p-3 scrollbar-hide resize-none" />
                    <IoSend className="w-12 h-12 my-1 text-white" />
                </div>
            </main>
            <aside className="flex flex-col w-[20%] pl-1 pr-2 py-2">
                <div className="flex-1 bg-[#252525dd] h-full rounded-lg p-4 overflow-y-auto scrollbar-hide">
                    <div className="text-white font-bold text-lg my-2">
                        Online Friends
                    </div>
                    <div className="text-white flex items-center mb-1 p-0.5 hover:bg-[#25252544] rounded">
                        <img
                            src="/login_background.jpg"
                            className="w-6 h-6 rounded-lg"
                        />
                        <div className="ml-2 text-sm">Friend 1</div>
                    </div>
                    <div className="text-white flex items-center mb-1 p-0.5 hover:bg-[#25252544] rounded">
                        <img
                            src="/login_background.jpg"
                            className="w-6 h-6 rounded-lg"
                        />
                        <div className="ml-2 text-sm">Friend 2</div>
                    </div>
                    <div className="text-white flex items-center mb-1 p-0.5 hover:bg-[#25252544] rounded">
                        <img
                            src="/login_background.jpg"
                            className="w-6 h-6 rounded-lg"
                        />
                        <div className="ml-2 text-sm">Friend 3</div>
                    </div>
                </div>
                <div className="bg-[#252525dd] mt-2 h-20 rounded-lg flex items-center justify-around p-4">
                    <img
                        src="/login_background.jpg"
                        className="w-10 h-10 rounded-lg"
                    />{/*User Profile*/}
                    <BiMicrophone className="w-10 h-10 my-1 text-white" />{/*Microphone Control*/}
                    <TbHeadphones className="w-10 h-10 my-1 text-white" />{/*Headphone Control*/}
                    <MdOutlineSettings className="w-10 h-10 my-1 text-white" />{/*Settings*/}
                </div>
            </aside>
        </div>
    );
}
export default Chats;

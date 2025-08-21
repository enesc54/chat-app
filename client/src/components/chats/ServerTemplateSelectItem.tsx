import { MdOutlineSchool, MdWorkOutline } from "react-icons/md";
import { IoPeopleOutline, IoGameControllerOutline } from "react-icons/io5";
import { TbTemplateOff } from "react-icons/tb";

export enum ServerTemplateTypes {
    NOT_USING = "NOT_USING",
    GAMING = "GAMING",
    FRIENDS = "FRIENDS",
    SCHOOL = "SCHOOL",
    WORKING = "WORKING"
}

const options = {
    [ServerTemplateTypes.NOT_USING]: {
        text: "Create without using a template",
        icon: <TbTemplateOff className="h-12 w-12" />
    },
    [ServerTemplateTypes.GAMING]: {
        text: "Gaming",
        icon: <IoGameControllerOutline className="h-12 w-12" />
    },
    [ServerTemplateTypes.FRIENDS]: {
        text: "Friends",
        icon: <IoPeopleOutline className="h-12 w-12" />
    },
    [ServerTemplateTypes.SCHOOL]: {
        text: "School",
        icon: <MdOutlineSchool className="h-12 w-12" />
    },
    [ServerTemplateTypes.WORKING]: {
        text: "Working",
        icon: <MdWorkOutline className="h-12 w-12" />
    }
};

function ServerTemplateSelectItem({ type , setSelectedType}) {
  const handleClick=()=>{
    setSelectedType(type)
  }
  
    return (
        <div onClick={handleClick} className="h-24 bg-[#252525] flex items-center shadow-lg p-8 rounded-xl gap-8 text-2xl font-bold mb-6">
            {options[type].icon}
            {options[type].text}
        </div>
    );
}

export default ServerTemplateSelectItem;
